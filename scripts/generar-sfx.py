#!/usr/bin/env python3
"""Sintetiza los efectos de sonido del video (teclado, clic, notificación, etc.). Material 100 % propio.

Requisitos:  pip install numpy scipy soundfile
Uso:         python3 scripts/generar-sfx.py
Salida:      public/audio/sfx/*.wav
"""
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
RAIZ = Path(__file__).resolve().parent.parent
DEST = RAIZ / "public/audio/sfx"
rng = np.random.default_rng(11)


def filtro(x, tipo, f):
    return signal.sosfilt(signal.butter(2, f, tipo, fs=SR, output="sos"), x)


def tono(f, dur, tau, arm=(1, 0.25, 0.08)):
    t = np.arange(int(dur * SR)) / SR
    y = sum(a * np.sin(2 * np.pi * f * (k + 1) * t) for k, a in enumerate(arm))
    at = int(0.004 * SR)
    y[:at] *= np.linspace(0, 1, at)
    return y * np.exp(-t / tau)


def guardar(nombre, y, pico=0.7):
    y = np.asarray(y, dtype=float)
    y = y / (np.abs(y).max() + 1e-9) * pico
    f = int(0.01 * SR)
    y[-f:] *= np.linspace(1, 0, f)
    sf.write(DEST / f"{nombre}.wav", y, SR, subtype="PCM_16")
    print(f"{nombre}.wav  {len(y) / SR:.2f} s")


def tecla(fuerza=1.0):
    """Una tecla de notebook: clic corto + cuerpo grave."""
    n = int(0.07 * SR)
    t = np.arange(n) / SR
    clic = filtro(rng.standard_normal(n), "bandpass", [1800 + rng.uniform(-300, 500), 5200]) * np.exp(-t / 0.004)
    cuerpo = np.sin(2 * np.pi * (160 + rng.uniform(-25, 40)) * t) * np.exp(-t / 0.014)
    suelta = np.zeros(n)
    d = int(0.035 * SR)
    suelta[d:] = filtro(rng.standard_normal(n - d), "bandpass", [2500, 6000]) * np.exp(-t[: n - d] / 0.003) * 0.25
    return (clic * 0.8 + cuerpo * 0.5 + suelta) * fuerza


def tecleo(dur, ritmo=0.105):
    """Tecleo natural: ráfagas con pequeñas pausas, como alguien escribiendo código."""
    y = np.zeros(int(dur * SR) + SR)
    t = 0.05
    while t < dur - 0.1:
        k = tecla(rng.uniform(0.55, 1.0))
        i = int(t * SR)
        y[i:i + len(k)] += k
        paso = rng.normal(ritmo, 0.03)
        if rng.random() < 0.12:
            paso += rng.uniform(0.18, 0.4)    # pausa para pensar
        t += max(0.055, paso)
    return y[: int(dur * SR)]


def barrido(dur, f0, f1, forma=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = rng.standard_normal(n)
    out = np.zeros(n)
    paso = 1024
    for i in range(0, n, paso):
        fc = f0 + (f1 - f0) * (i / n) ** forma
        j0 = max(0, i - paso)
        seg = filtro(y[j0:i + paso], "bandpass", [fc * 0.6, fc * 1.6])
        out[i:i + paso] = seg[i - j0:][: len(out[i:i + paso])]
    return out * np.sin(np.pi * t / dur) ** 1.5


if __name__ == "__main__":
    DEST.mkdir(parents=True, exist_ok=True)

    # notificación: dos notas (La5 -> Re6), en la tonalidad de la música
    y = np.zeros(int(0.9 * SR))
    a, b = tono(880, 0.5, 0.16), tono(1174.66, 0.75, 0.22)
    y[: len(a)] += a
    i = int(0.11 * SR)
    y[i:i + len(b)] += b
    guardar("notificacion", y, 0.6)

    guardar("tecleo-largo", tecleo(5.0), 0.6)
    guardar("tecleo-corto", tecleo(2.2, 0.12), 0.6)

    # clic de mouse
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    y = filtro(rng.standard_normal(n), "bandpass", [1500, 4500]) * np.exp(-t / 0.003)
    d = int(0.055 * SR)
    y[d:] += 0.6 * filtro(rng.standard_normal(n - d), "bandpass", [2200, 5500]) * np.exp(-t[: n - d] / 0.0025)
    guardar("clic", y, 0.55)

    # toque suave de interfaz (aparece un elemento)
    t = np.arange(int(0.16 * SR)) / SR
    f = 320 + 420 * np.exp(-t / 0.02)
    guardar("toque", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035), 0.5)

    # mensaje enviado
    guardar("envio", barrido(0.32, 500, 3200, 1.6) + np.pad(tono(1318.5, 0.2, 0.06), (int(0.2 * SR), 0))[: int(0.32 * SR)] * 0.08, 0.5)

    # transición (aire)
    guardar("transicion", barrido(0.7, 300, 2600, 0.8), 0.5)
    guardar("transicion-baja", barrido(0.8, 2400, 250, 0.7), 0.45)

    # éxito: arpegio Re-Fa#-La-Re
    y = np.zeros(int(1.4 * SR))
    for k, f in enumerate((587.33, 739.99, 880.0, 1174.66)):
        nota = tono(f, 0.9, 0.22)
        i = int(k * 0.085 * SR)
        y[i:i + len(nota)] += nota[: len(y) - i] * (0.7 + 0.1 * k)
    guardar("exito", y, 0.55)

    # entrar a la videollamada: dos notas ascendentes
    y = np.zeros(int(0.8 * SR))
    for k, f in enumerate((587.33, 880.0)):
        nota = tono(f, 0.45, 0.14, (1, 0.12))
        i = int(k * 0.16 * SR)
        y[i:i + len(nota)] += nota
    guardar("llamada", y, 0.5)

    # lápiz sobre papel (boceto)
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    y = filtro(rng.standard_normal(n), "bandpass", [2500, 7000]) * (0.5 + 0.5 * np.sin(2 * np.pi * 5.5 * t) ** 2) * np.sin(np.pi * t / 0.9) ** 0.5
    guardar("lapiz", y, 0.3)

    # taza apoyada en el escritorio
    t = np.arange(int(0.25 * SR)) / SR
    y = np.sin(2 * np.pi * 210 * t) * np.exp(-t / 0.03) + 0.3 * np.sin(2 * np.pi * 1900 * t) * np.exp(-t / 0.05) + 0.3 * filtro(rng.standard_normal(len(t)), "lowpass", 900) * np.exp(-t / 0.012)
    guardar("taza", y, 0.4)
