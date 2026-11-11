#!/usr/bin/env python3
"""Genera la narración (voz en off) a partir de src/datos/guion.json.

Motor: Piper TTS (código abierto, se ejecuta sin conexión). Voz por defecto: es_MX-claude-high
(español latinoamericano neutro, licencia Apache-2.0).

Requisitos:  pip install piper-tts numpy scipy soundfile
Uso:         python3 scripts/generar-voz.py

Salidas:
  public/audio/voz/<id>.wav        una frase por archivo (48 kHz, mono, ya ecualizada)
  src/datos/voz-tiempos.json       duración de cada frase y cortes para los subtítulos

PARA USAR UNA VOZ HUMANA (recomendado): graba cada frase del guion, guárdala como
public/audio/voz/<id>.wav y ejecuta  python3 scripts/generar-voz.py --solo-medir
para recalcular duraciones y subtítulos sin volver a sintetizar.
"""
import json, sys, wave, urllib.request
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy import signal

RAIZ = Path(__file__).resolve().parent.parent
GUION = RAIZ / "src/datos/guion.json"
SALIDA = RAIZ / "public/audio/voz"
TIEMPOS = RAIZ / "src/datos/voz-tiempos.json"
CACHE = RAIZ / ".cache/voces"
SR = 48000
SOLO_MEDIR = "--solo-medir" in sys.argv


def descargar_voz(nombre: str) -> Path:
    """Descarga el modelo de voz de Piper desde Hugging Face si no está en .cache/voces."""
    CACHE.mkdir(parents=True, exist_ok=True)
    idioma, hablante, calidad = nombre.split("-")
    base = f"https://huggingface.co/rhasspy/piper-voices/resolve/main/{idioma[:2]}/{idioma}/{hablante}/{calidad}/{nombre}"
    for ext in (".onnx", ".onnx.json"):
        destino = CACHE / (nombre + ext)
        if not destino.exists():
            print("Descargando", destino.name)
            urllib.request.urlretrieve(base + ext, destino)
    return CACHE / (nombre + ".onnx")


def masterizar(x: np.ndarray, sr: int) -> np.ndarray:
    """Limpia y da calidez a la voz: 48 kHz, filtro de graves, presencia, compresión suave y un poco de sala."""
    if sr != SR:
        g = np.gcd(SR, sr)
        x = signal.resample_poly(x, SR // g, sr // g)
    # recorta silencios de los extremos
    env = np.abs(signal.hilbert(x))
    idx = np.where(env > 0.01)[0]
    if len(idx):
        x = x[max(0, idx[0] - int(0.03 * SR)): idx[-1] + int(0.12 * SR)]
    sos = signal.butter(2, 85, "highpass", fs=SR, output="sos")
    x = signal.sosfilt(sos, x)

    def campana(x, f, q, db):
        a = 10 ** (db / 40); w = 2 * np.pi * f / SR; al = np.sin(w) / (2 * q)
        b = [1 + al * a, -2 * np.cos(w), 1 - al * a]; den = [1 + al / a, -2 * np.cos(w), 1 - al / a]
        return signal.lfilter(np.array(b) / den[0], np.array(den) / den[0], x)

    x = campana(x, 180, 0.9, 1.5)     # cuerpo
    x = campana(x, 450, 1.2, -1.5)    # menos "caja"
    x = campana(x, 3200, 1.0, 2.0)    # presencia
    x = campana(x, 7500, 0.8, 2.5)    # aire
    # compresión suave (envolvente RMS)
    n = int(0.01 * SR)
    rms = np.sqrt(signal.lfilter(np.ones(n) / n, [1], x ** 2) + 1e-9)
    db = 20 * np.log10(rms)
    gan = np.where(db > -22, -(db + 22) * (1 - 1 / 2.5), 0.0)
    gan = signal.lfilter([0.002], [1, -0.998], gan)
    x = x * 10 ** (gan / 20)
    # sala muy corta para quitar lo "seco" del TTS
    rng = np.random.default_rng(7)
    t = np.arange(int(0.28 * SR)) / SR
    ri = rng.standard_normal(len(t)) * np.exp(-t / 0.06)
    ri = signal.sosfilt(signal.butter(2, [300, 5000], "bandpass", fs=SR, output="sos"), ri)
    ri /= np.sqrt((ri ** 2).sum())
    cola = signal.fftconvolve(x, ri)
    x = np.concatenate([x, np.zeros(len(cola) - len(x))])
    x = x + 0.07 * cola
    f = int(0.02 * SR)
    x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    return x


def pausas(x: np.ndarray) -> list:
    """Devuelve los puntos medios (s) de las pausas internas de la frase."""
    n = int(0.01 * SR)
    marcos = x[: len(x) // n * n].reshape(-1, n)
    e = 20 * np.log10(np.sqrt((marcos ** 2).mean(1)) + 1e-9)
    silencio = e < (e.max() - 32)
    res, i = [], 0
    while i < len(silencio):
        if silencio[i]:
            j = i
            while j < len(silencio) and silencio[j]:
                j += 1
            if i > 5 and j < len(silencio) - 5 and (j - i) >= 7:
                res.append(((i + j) / 2 * n / SR, (j - i) * n / SR))
            i = j
        else:
            i += 1
    return res


def cortes_subtitulos(subs: list, dur: float, ps: list) -> list:
    """Reparte los subtítulos dentro de la frase: usa las pausas reales cuando el trozo termina en puntuación."""
    largo = [len(s) for s in subs]
    total = sum(largo)
    cortes, acum, usadas = [0.0], 0, set()
    for k, s in enumerate(subs[:-1]):
        acum += largo[k]
        t = dur * acum / total
        if s.rstrip()[-1] in ",.;:…?!" and ps:
            cand = sorted(((abs(p[0] - t), i) for i, p in enumerate(ps) if i not in usadas))
            if cand and cand[0][0] < 0.9:
                usadas.add(cand[0][1]); t = ps[cand[0][1]][0]
        cortes.append(round(max(t, cortes[-1] + 0.25), 3))
    cortes.append(round(dur, 3))
    return cortes


def main():
    guion = json.loads(GUION.read_text(encoding="utf-8"))
    SALIDA.mkdir(parents=True, exist_ok=True)
    voz = None
    if not SOLO_MEDIR:
        from piper import PiperVoice, SynthesisConfig
        voz = PiperVoice.load(str(descargar_voz(guion["voz"]["modelo"])))
        cfg = SynthesisConfig(length_scale=guion["voz"]["velocidad"], noise_scale=0.6, noise_w_scale=0.75)
    crudos = {}
    for version in ("completo", "corto"):
        for linea in guion[version]:
            destino = SALIDA / f"{linea['id']}.wav"
            if SOLO_MEDIR:
                x, sr = sf.read(destino)
                crudos[linea["id"]] = (x if x.ndim == 1 else x.mean(1), sr, False)
            else:
                tmp = CACHE / "_tmp.wav"
                with wave.open(str(tmp), "wb") as w:
                    voz.synthesize_wav(linea["tts"], w, syn_config=cfg)
                x, sr = sf.read(tmp)
                crudos[linea["id"]] = (masterizar(x, sr), SR, True)
    # mismo nivel para todas las frases sintetizadas
    pico = max(np.abs(x).max() for x, _, nuevo in crudos.values() if nuevo) if not SOLO_MEDIR else 1
    tiempos = {}
    for version in ("completo", "corto"):
        previo_fin = 0
        for linea in guion[version]:
            x, sr, nuevo = crudos[linea["id"]]
            if nuevo:
                x = x / pico * 0.84
                sf.write(SALIDA / f"{linea['id']}.wav", x, SR, subtype="PCM_16")
            elif sr != SR:
                g = np.gcd(SR, sr); x = signal.resample_poly(x, SR // g, sr // g)
            dur = len(x) / SR
            # la cola de sala no cuenta como habla
            habla = dur - (0.28 if nuevo else 0)
            tiempos[linea["id"]] = {"dur": round(dur, 3), "habla": round(habla, 3), "cortes": cortes_subtitulos(linea["subs"], habla, pausas(x))}
            fin = linea["inicio"] + habla
            aviso = "  <-- SE PISA CON LA ANTERIOR" if linea["inicio"] < previo_fin else ""
            print(f"{linea['id']}  {linea['inicio']:6.2f} -> {fin:6.2f}  ({habla:4.2f}s)  {linea['tts'][:60]}{aviso}")
            previo_fin = fin
        print()
    TIEMPOS.write_text(json.dumps(tiempos, indent=2), encoding="utf-8")
    print("Listo:", TIEMPOS.relative_to(RAIZ))


if __name__ == "__main__":
    main()
