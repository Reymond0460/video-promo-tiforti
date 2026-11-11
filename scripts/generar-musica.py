#!/usr/bin/env python3
"""Compone y sintetiza la música original del video (no usa samples ni material de terceros).

Instrumental en Re mayor, 96 BPM (un compás = 2,5 s, así cada escena cae justo en un cambio de compás).
Empieza íntima (piano y colchón), suma pulso al aparecer TiforTi, crece en el montaje de trabajo,
se detiene en el momento de la entrega y cierra abierta y optimista.

Requisitos:  pip install numpy scipy soundfile
Uso:         python3 scripts/generar-musica.py
Salidas:     public/audio/musica-completa.wav (75 s) y public/audio/musica-corta.wav (30 s)
"""
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
BPM = 96
NEGRA = 60 / BPM          # 0.625 s
COMPAS = 4 * NEGRA        # 2.5 s
RAIZ = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(2026)
DEPURAR = "--niveles" in __import__("sys").argv


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- acordes (notas MIDI)
ACORDES = {
    "Bm7":  dict(bajo=35, voz=[59, 62, 66, 69]),
    "Gadd9": dict(bajo=31, voz=[55, 59, 62, 69]),
    "G":    dict(bajo=31, voz=[55, 59, 62, 67]),
    "D/F#": dict(bajo=30, voz=[57, 62, 66, 69]),
    "D":    dict(bajo=38, voz=[57, 62, 66, 69]),
    "A":    dict(bajo=33, voz=[57, 61, 64, 69]),
    "Asus": dict(bajo=33, voz=[57, 62, 64, 69]),
    "Em7":  dict(bajo=28, voz=[55, 59, 62, 64]),
    "Bm":   dict(bajo=35, voz=[59, 62, 66, 71]),
}


class Pista:
    """Buffer estéreo donde se van sumando notas."""

    def __init__(self, dur):
        self.x = np.zeros((int(dur * SR) + SR * 6, 2))

    def sumar(self, t, mono, pan=0.0, gan=1.0):
        i = int(t * SR)
        if i < 0 or i >= len(self.x):
            return
        n = min(len(mono), len(self.x) - i)
        izq, der = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.x[i:i + n, 0] += mono[:n] * izq * gan
        self.x[i:i + n, 1] += mono[:n] * der * gan


def env_ataque(n, ms):
    a = min(n, int(ms / 1000 * SR))
    e = np.ones(n)
    e[:a] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a))
    return e


def piano(m, dur, vel=0.6):
    """Piano de fieltro: parciales levemente inarmónicos, los agudos se apagan antes."""
    f = hz(m)
    n = int((dur + 1.6) * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    brillo = 0.55 + 0.6 * vel
    for k in range(1, 9):
        fk = f * k * np.sqrt(1 + 0.00035 * k * k)
        if fk > 9000:
            break
        amp = k ** (-2.1 + brillo * 0.5) * (1.0 if k > 1 else 1.15)
        tau = (2.6 * (220 / f) ** 0.35) / k ** 0.85
        golpe = 0.55 * np.exp(-t / 0.09) + 0.45
        y += amp * np.sin(2 * np.pi * fk * t + rng.uniform(0, 0.4)) * np.exp(-t / tau) * golpe
        y += 0.35 * amp * np.sin(2 * np.pi * fk * 1.0009 * t) * np.exp(-t / tau)
    # martillo: un soplido muy corto
    ruido = rng.standard_normal(int(0.02 * SR)) * np.exp(-np.arange(int(0.02 * SR)) / (0.004 * SR))
    ruido = signal.sosfilt(signal.butter(2, [600, 3000], "bandpass", fs=SR, output="sos"), ruido)
    y[: len(ruido)] += 0.05 * vel * ruido
    y *= env_ataque(n, 6)
    # apagador al soltar la nota
    s = int(dur * SR)
    y[s:] *= np.exp(-np.arange(n - s) / (0.35 * SR))
    y = signal.sosfilt(signal.butter(2, 2600 + 2400 * vel, "lowpass", fs=SR, output="sos"), y)
    return y * vel * 0.32


def colchon(m, dur, brillo=1.0):
    """Pad cálido: sierras desafinadas con pocos armónicos, ataque y cola lentos."""
    f = hz(m)
    n = int((dur + 1.8) * SR)
    t = np.arange(n) / SR
    canales = []
    for desaf in ((-0.07, 0.05, 0.11), (0.08, -0.04, -0.12)):
        y = np.zeros(n)
        for d in desaf:
            fd = f * 2 ** (d / 12)
            for k in range(1, 9):
                if fd * k > 5000:
                    break
                y += np.sin(2 * np.pi * fd * k * t + rng.uniform(0, 6.28)) / k ** (2.2 - 0.5 * brillo)
        canales.append(y)
    y = np.stack(canales, 1)
    a, r = int(0.9 * SR), int(1.6 * SR)
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a) ** 1.5
    s = int(dur * SR)
    e[s:] = np.clip(1 - np.arange(n - s) / r, 0, 1) ** 2
    y *= e[:, None] * (1 + 0.06 * np.sin(2 * np.pi * 0.23 * t))[:, None]
    return y * 0.022


def punteo(m, vel=0.5):
    """Nota pulsada corta (arpegio)."""
    f = hz(m)
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    y = (np.sin(2 * np.pi * f * t) + 0.42 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.07)
         + 0.2 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t / 0.04))
    y *= np.exp(-t / (0.11 + 0.08 * vel)) * env_ataque(n, 3)
    return y * vel * 0.2


def campana(m, dur=1.4, vel=0.5):
    """Campanita suave para la melodía."""
    f = hz(m)
    n = int((dur + 1.2) * SR)
    t = np.arange(n) / SR
    y = (np.sin(2 * np.pi * f * t) * np.exp(-t / (0.7 * dur))
         + 0.22 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / (0.35 * dur))
         + 0.10 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t / (0.18 * dur))
         + 0.05 * np.sin(2 * np.pi * 4.2 * f * t) * np.exp(-t / 0.08))
    return y * env_ataque(n, 8) * vel * 0.2


def bajo(m, dur, vel=0.6):
    f = hz(m)
    n = int((dur + 0.15) * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.08 * np.sin(2 * np.pi * 3 * f * t)
    e = env_ataque(n, 12) * np.exp(-t / (dur * 1.4))
    s = int(dur * SR)
    e[s:] *= np.linspace(1, 0, n - s)
    return np.tanh(y * e * 1.3) * vel * 0.34


def bombo(vel=0.8):
    n = int(0.32 * SR)
    t = np.arange(n) / SR
    f = 46 + 70 * np.exp(-t / 0.035)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.13)
    y += 0.12 * rng.standard_normal(n) * np.exp(-t / 0.004)
    return y * env_ataque(n, 1.5) * vel * 0.55


def chasquido(vel=0.5):
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for d in (0, 0.011, 0.022):
        e = np.where(t >= d, np.exp(-(t - d) / 0.045), 0)
        y += rng.standard_normal(n) * e
    y = signal.sosfilt(signal.butter(2, [1100, 4200], "bandpass", fs=SR, output="sos"), y)
    return y * vel * 0.34


def shaker(vel=0.4, largo=0.05):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    y = rng.standard_normal(n) * np.exp(-t / largo) * env_ataque(n, 4)
    y = signal.sosfilt(signal.butter(2, 6500, "highpass", fs=SR, output="sos"), y)
    return y * vel * 0.26


def subida(dur):
    """Ruido que se abre: empuja hacia el siguiente bloque."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = rng.standard_normal(n)
    out = np.zeros(n)
    paso = 2048
    for i in range(0, n, paso):
        fc = 400 + 5500 * (i / n) ** 2
        sos = signal.butter(2, [fc * 0.7, fc * 1.4], "bandpass", fs=SR, output="sos")
        j0 = max(0, i - paso)
        seg = signal.sosfilt(sos, y[j0:i + paso])
        out[i:i + paso] = seg[i - j0: i - j0 + paso][: len(out[i:i + paso])]
    return out * (t / dur) ** 2.2 * 0.09


def reverberar(x, cola=2.4, mezcla=1.0):
    n = int(cola * SR)
    t = np.arange(n) / SR
    ri = rng.standard_normal((n, 2)) * np.exp(-t / (cola / 5.5))[:, None]
    sos = signal.butter(2, [250, 5200], "bandpass", fs=SR, output="sos")
    ri = signal.sosfilt(sos, ri, axis=0)
    ri[: int(0.012 * SR)] = 0
    ri /= np.sqrt((ri ** 2).sum(0)).max()
    h = np.stack([signal.fftconvolve(x[:, c], ri[:, c])[: len(x)] for c in range(2)], 1)
    return h * mezcla


# ---------------------------------------------------------------- arreglo
# Cada compás: (acorde, bloque). Bloques: A íntimo · B esperanza · C conversación · D trabajo
# P pausa (entrega) · S crecida · F final con todo · Z acorde final que queda sonando
COMPLETO = (
    [("Bm7", "A"), ("Gadd9", "A"), ("D/F#", "A"), ("Asus", "A")]                      # 0-10 s   el problema
    + [("G", "A2"), ("D", "B"), ("A", "B"), ("Bm", "B")]                              # 10-20 s  aparece TiforTi
    + [("Gadd9", "C"), ("D/F#", "C"), ("Em7", "C"), ("A", "C")]                       # 20-30 s  conversamos
    + [("D", "D"), ("A", "D"), ("Bm", "D"), ("G", "D"), ("D", "D"), ("A", "D"), ("G", "D!")]  # 30-47,5 s manos a la obra
    + [("Em7", "P"), ("Gadd9", "P"), ("D/F#", "P"), ("Asus", "S"), ("A", "S!")]       # 47,5-60 s la entrega
    + [("D", "F"), ("A", "F"), ("Bm", "F"), ("G", "F!"), ("D", "Z"), ("D", "-")]      # 60-75 s  cierre
)
CORTO = (
    [("Bm7", "A"), ("Gadd9", "A2")]                                                   # 0-5 s
    + [("D", "B"), ("A", "C")]                                                        # 5-10 s
    + [("D", "D"), ("A", "D"), ("Bm", "D"), ("G", "D!")]                              # 10-20 s
    + [("Em7", "P"), ("A", "S!")]                                                     # 20-25 s
    + [("D", "Z"), ("D", "-")]                                                        # 25-30 s
)

# melodía por bloque: (pulso dentro del compás, nota MIDI, duración en pulsos, intensidad)
MELODIAS = {
    "C": [[(0, 78, 2, .5), (2, 81, 2, .45)], [(0, 86, 3, .5), (3, 83, 1, .4)], [(0, 81, 2, .45), (2, 79, 2, .4)], [(0, 76, 2, .45), (2.5, 81, 1.5, .45)]],
    "P": [[(1, 79, 3, .4)], [(0, 83, 4, .42)], [(0, 81, 2.5, .42), (3, 78, 1, .35)]],
    "S": [[(0, 78, 2, .42), (2, 81, 2, .46)], [(0, 85, 2, .5), (2, 88, 2, .55)]],
    "F": [[(0, 78, .5, .5), (.5, 81, .5, .5), (1, 86, 2, .6), (3, 81, 1, .5)], [(0, 88, 1.5, .6), (1.5, 85, 1.5, .55), (3, 81, 1, .5)],
          [(0, 86, 1.5, .6), (1.5, 83, 1.5, .55), (3, 78, 1, .5)], [(0, 79, 1, .5), (1, 83, 1, .55), (2, 86, 1, .6), (3, 88, 1, .62)]],
}


def componer(arreglo, salida, fundido_final=3.5):
    dur = len(arreglo) * COMPAS
    seco, humedo, graves = Pista(dur), Pista(dur), Pista(dur)   # humedo -> va a la reverberación
    pad = np.zeros((int(dur * SR) + SR * 6, 2))
    cuenta = {}

    def poner_pad(t, m, d, g=1.0, brillo=1.0):
        y = colchon(m, d, brillo) * g
        i = int(t * SR)
        n = min(len(y), len(pad) - i)
        pad[i:i + n] += y[:n]

    for c, (nombre, bloque) in enumerate(arreglo):
        t0 = c * COMPAS
        ac = ACORDES[nombre]
        voz, b = ac["voz"], ac["bajo"]
        base = bloque.rstrip("!2")
        k = cuenta.get(base, 0)
        cuenta[base] = k + 1
        p = lambda pulso: t0 + pulso * NEGRA  # noqa: E731
        humano = lambda: rng.uniform(-0.006, 0.008)  # noqa: E731

        if base == "-":
            continue

        # ---- colchón (en todos los bloques, cambia el peso)
        peso = {"A": .5, "B": .8, "C": .85, "D": .75, "P": .7, "S": 1.1, "F": 1.0, "Z": 1.2}[base]
        largo = COMPAS * (2.2 if base == "Z" else 1.0)
        for m in voz[:3]:
            poner_pad(t0, m, largo, peso, brillo=1.0 if base in "DFSZ" else 0.6)
        poner_pad(t0, b + 24, largo, peso * 0.6, 0.5)

        # ---- piano
        if base == "A":
            for i, m in enumerate(voz):
                humedo.sumar(p(0) + i * 0.035, piano(m, 2.2, .42), pan=(m - 62) / 30)
            humedo.sumar(p(2) + humano(), piano(voz[2], 1.2, .3), pan=.1)
            humedo.sumar(p(3) + humano(), piano(voz[3], 1.0, .33), pan=.2)
            if bloque == "A2":
                humedo.sumar(p(3.5), piano(voz[3] + 2, .6, .3), pan=.25)
            humedo.sumar(p(0), piano(b + 12, 2.4, .4), pan=-.2)
        elif base == "B":
            for i, m in enumerate(voz):
                humedo.sumar(p(0) + i * 0.02, piano(m, 1.6, .5), pan=(m - 62) / 30)
            humedo.sumar(p(0), piano(b + 12, 2.0, .45), pan=-.2)
            for i, idx in enumerate([0, 2, 1, 3]):
                humedo.sumar(p(2 + i * .5) + humano(), piano(voz[idx], .5, .36), pan=(idx - 1.5) / 4)
        elif base == "C":
            for pulso, v in ((0, .5), (1.5, .4), (3, .42)):
                for i, m in enumerate(voz):
                    humedo.sumar(p(pulso) + i * 0.012 + humano(), piano(m, .9, v), pan=(m - 62) / 30)
        elif base in ("D", "F"):
            fuerza = .52 if base == "D" else .6
            for pulso, v in ((0, 1), (1.5, .8), (2.5, .7), (3.5, .75)):
                for i, m in enumerate(voz):
                    humedo.sumar(p(pulso) + i * 0.008 + humano(), piano(m, .55, fuerza * v), pan=(m - 62) / 30)
        elif base == "P":
            for i, m in enumerate(voz):
                humedo.sumar(p(0) + i * 0.06, piano(m, 2.4, .3), pan=(m - 62) / 30)
        elif base == "S":
            for pulso, v in ((0, .42), (2, .5)):
                for i, m in enumerate(voz):
                    humedo.sumar(p(pulso) + i * 0.02, piano(m, 1.2, v), pan=(m - 62) / 30)
            if bloque.endswith("!"):
                for i in range(8):   # corcheas que empujan
                    humedo.sumar(p(i * .5), piano(voz[(i * 2) % 4] + (12 if i > 3 else 0), .4, .3 + .035 * i), pan=.2)
        elif base == "Z":
            for i, m in enumerate([b + 12, b + 24] + voz + [voz[1] + 12, voz[3] + 12]):
                humedo.sumar(p(0) + i * 0.018, piano(m, 4.5, .62), pan=(m - 62) / 28)
            humedo.sumar(p(0), campana(86, 3.5, .6), pan=.15)
            humedo.sumar(p(0.02), campana(90, 3.5, .35), pan=-.2)

        # ---- arpegio pulsado
        if base in ("B", "C"):
            patron = [0, 1, 2, 3, 2, 1, 2, 3]
            for i, idx in enumerate(patron):
                humedo.sumar(p(i * .5) + humano(), punteo(voz[idx] + 12, .32 + .1 * (i % 2 == 0)), pan=.5 if i % 2 else -.5, gan=.9 if base == "B" else 1.0)
        elif base in ("D", "F"):
            patron = [0, 2, 1, 3, 2, 3, 1, 2, 0, 2, 3, 1, 2, 3, 1, 3]
            for i, idx in enumerate(patron):
                humedo.sumar(p(i * .25) + humano() * .5, punteo(voz[idx] + 12, .28 + .16 * (i % 4 == 0) + .06 * (i % 2 == 0)), pan=.55 if i % 2 else -.55)

        # ---- bajo
        if base == "C":
            graves.sumar(p(0), bajo(b + 12 if b < 33 else b, 2.2, .5))
        elif base in ("D", "F"):
            nb = b + 12 if b < 33 else b
            for pulso, d, v in ((0, .9, .7), (1.5, .45, .55), (2, .9, .65), (3.5, .45, .55)):
                graves.sumar(p(pulso), bajo(nb, d * NEGRA, v))
        elif base == "S":
            graves.sumar(p(0), bajo(b + 12, 2.3, .45))
        elif base == "Z":
            graves.sumar(p(0), bajo(b, 3.5, .7))

        # ---- percusión
        if base == "C":
            for i in range(8):
                seco.sumar(p(i * .5) + humano(), shaker(.22 + .14 * (i % 2)), pan=.3)
            if k >= 2:
                graves.sumar(p(0), bombo(.45))
        elif base in ("D", "F"):
            entrada = base == "D" and k == 0
            for pulso in ((0, 2.5) if entrada else (0, 1.75, 2.5) if k % 2 else (0, 2.5)):
                graves.sumar(p(pulso), bombo(.7 if base == "D" else .8))
            for pulso in (1, 3):
                humedo.sumar(p(pulso) + 0.004, chasquido(.5 if base == "D" else .6), pan=.1, gan=.6)
                seco.sumar(p(pulso) + 0.004, chasquido(.5 if base == "D" else .6), pan=-.1)
            for i in range(16):
                seco.sumar(p(i * .25) + humano() * .5, shaker(.16 + .2 * (i % 4 == 2) + .08 * (i % 2 == 0), .03), pan=.35)
        elif base == "S" and bloque.endswith("!"):
            for i, pulso in enumerate((0, 1, 2, 2.5, 3, 3.25, 3.5, 3.75)):
                graves.sumar(p(pulso), bombo(.3 + .05 * i))
        elif base == "Z":
            graves.sumar(p(0), bombo(.85))
            seco.sumar(p(0), shaker(.5, .25), pan=.2)

        # ---- subidas antes de un cambio de bloque
        if bloque.endswith("!") and base in ("D", "S", "F"):
            seco.sumar(t0, subida(COMPAS), pan=0, gan=1.0 if base != "F" else .7)
            humedo.sumar(t0, subida(COMPAS), pan=0, gan=.5)

        # ---- melodía
        if base in MELODIAS:
            frases = MELODIAS[base]
            for pulso, m, d, v in frases[k % len(frases)]:
                humedo.sumar(p(pulso) + humano(), campana(m, d * NEGRA * 1.4, v * (1.0 if base != "F" else 1.1)), pan=.12)
                if base == "F":
                    humedo.sumar(p(pulso) + humano(), piano(m - 12, d * NEGRA, v * .7), pan=-.1)

    # ---- mezcla
    pad = signal.sosfilt(signal.butter(2, 1500, "lowpass", fs=SR, output="sos"), pad, axis=0)
    pad = signal.sosfilt(signal.butter(2, 180, "highpass", fs=SR, output="sos"), pad, axis=0)
    env = humedo.x + 0.5 * pad
    mezcla = seco.x + graves.x + humedo.x * 0.9 + pad + reverberar(env, 2.6, 0.2) + reverberar(seco.x, 1.0, 0.05)
    mezcla = signal.sosfilt(signal.butter(2, 32, "highpass", fs=SR, output="sos"), mezcla, axis=0)
    n = int(dur * SR)
    if DEPURAR:
        for nombre_p, pista in (("seco", seco.x), ("graves", graves.x), ("humedo", humedo.x), ("pad", pad)):
            niveles = [20 * np.log10(np.sqrt((pista[int(c * COMPAS * SR): int((c + 1) * COMPAS * SR)] ** 2).mean()) + 1e-9) for c in range(len(arreglo))]
            print(f"{nombre_p:7s}", " ".join(f"{v:4.0f}" for v in niveles))
    mezcla = mezcla[:n]
    # limitador suave (sin aplastar la dinámica entre bloques)
    mezcla /= np.percentile(np.abs(mezcla), 99.9) / 0.8
    mezcla = np.tanh(mezcla * 1.15) / 1.15
    mezcla /= np.abs(mezcla).max() / 0.89
    f = int(fundido_final * SR)
    mezcla[-f:] *= (np.cos(np.linspace(0, np.pi, f)) * 0.5 + 0.5)[:, None]
    mezcla[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))[:, None]
    sf.write(salida, mezcla, SR, subtype="PCM_16")
    por_compas = [20 * np.log10(np.sqrt((mezcla[int(c * COMPAS * SR): int((c + 1) * COMPAS * SR)] ** 2).mean()) + 1e-9) for c in range(len(arreglo))]
    print(f"{salida.name}: {dur:.1f} s · nivel por compás (dBFS):", " ".join(f"{v:.0f}" for v in por_compas))


if __name__ == "__main__":
    destino = RAIZ / "public/audio"
    destino.mkdir(parents=True, exist_ok=True)
    componer(COMPLETO, destino / "musica-completa.wav")
    componer(CORTO, destino / "musica-corta.wav", fundido_final=3.0)
