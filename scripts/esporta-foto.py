#!/usr/bin/env python3
"""Esporta le foto sorgente del maso in webp responsive per public/img.

Le foto originali (4032x2268 jpg da drone, 5-10 MB l'una) non stanno nel repo:
vivono in ~/siti/immagini_immich_sette_fontane. Questo script le riduce alle
larghezze che il sito serve davvero e le scrive come webp, una variante per
tier di `sizes`; `responsive()` in src/data/content.js ricompone src + srcSet
dal nome base e dalle larghezze.

Le due famiglie di immagini hanno due lavori diversi, quindi due trattamenti:
 - SFONDI: decorativi, desaturati via CSS e sotto un velo (vedi SfondoSezione)
   — nessuno li guarda in dettaglio. Si fermano a 1600 px e passano da una
   sfocatura di 0.4 px prima di essere codificati.
 - FIGURE: sono il soggetto, si guardano. Nessuna sfocatura, qualita' alta.

Sulla sfocatura: qui il peso NON viene dalla quantizzazione ma dal dettaglio ad
alta frequenza (fogliame dei filari a tutto campo). Misurato: passare da q62 a
q40 su `vista_sopraelevata_campi` a 1600 px fa risparmiare il 20% e degrada
visibilmente; 0.4 px di sfocatura ne fa risparmiare altrettanto ed e'
impercettibile sotto il velo. La sfocatura e' la leva giusta per gli sfondi,
la qualita' no — non abbassarla ulteriormente sperando in guadagni.

Uso: python3 scripts/esporta-foto.py
"""

from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

SORGENTI = Path.home() / "siti" / "immagini_immich_sette_fontane"
DEST = Path(__file__).resolve().parent.parent / "public" / "img"

# Gli sfondi restano nel 16:9 nativo: sono full-bleed sotto `object-cover`,
# ritagliarli al 3:2 dei vecchi segnaposto butterebbe via larghezza utile.
LARGHEZZE_SFONDO = [640, 1024, 1600]
LARGHEZZE_FIGURA = [480, 720, 960]

SFONDO = dict(larghezze=LARGHEZZE_SFONDO, qualita=58, sfocatura=0.4)
FIGURA = dict(larghezze=LARGHEZZE_FIGURA, qualita=76, sfocatura=0)

# (sorgente, nome base in public/img, ritaglio | None, parametri)
# ritaglio = (aspect_w, aspect_h, ancora_y) con ancora_y = frazione dell'altezza
# originale da cui parte il taglio.
LAVORI = [
    # --- sfondi di sezione ---
    ("campagna_con_maso.jpg", "sfondo-maso-campagna", None, SFONDO),
    ("campi_con_valle_adige.jpg", "sfondo-valle-crepuscolo", None, SFONDO),
    # `vista_sopraelevata_campi.jpg` (zenitale sui filari) NON e' esportata:
    # provata come sfondo del Territorio, desaturata sotto il velo chiaro il
    # reticolo dei filari legge come graffi sulla pagina. Era anche la piu'
    # pesante del lotto (356 KB a 1600) proprio per quel dettaglio fitto.
    ("vidsuale_campi_montagne.jpg", "sfondo-vigne-monti-sera", None, SFONDO),
    ("maso_sette_fontane.jpg", "sfondo-maso-esterno", None, SFONDO),
    ("visuale_sopraelevata_campi.jpg", "sfondo-maso-vigne", None, SFONDO),
    ("visuale_valle_adige_3.jpg", "sfondo-valle-foschia", None, SFONDO),
    ("visuale_valle_adige_2.jpg", "sfondo-valle-mattino", None, SFONDO),
    # --- figure (soggetti) ---
    # 4:5 come l'`aspect-[4/5]` della figura dell'Azienda; l'ancora al 22%
    # taglia il cielo e tiene il maso in alto e i filari a riempire il basso.
    ("maso_sette_fontane_verticale.jpg", "maso-vigne", (4, 5, 0.22), FIGURA),
]


def ritaglia(im, aspect_w, aspect_h, ancora_y):
    w, h = im.size
    th = int(w * aspect_h / aspect_w)
    if th <= h:
        top = min(int(ancora_y * h), h - th)
        return im.crop((0, top, w, top + th))
    tw = int(h * aspect_w / aspect_h)
    left = (w - tw) // 2
    return im.crop((left, 0, left + tw, h))


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    totale = 0
    for nome, base, taglio, par in LAVORI:
        # exif_transpose: le verticali arrivano come landscape + orientamento 8.
        im = ImageOps.exif_transpose(Image.open(SORGENTI / nome)).convert("RGB")
        if taglio:
            im = ritaglia(im, *taglio)
        for w in par["larghezze"]:
            h = round(im.height * w / im.width)
            out = DEST / f"{base}-{w}.webp"
            ridotta = im.resize((w, h), Image.LANCZOS)
            if par["sfocatura"]:
                ridotta = ridotta.filter(ImageFilter.GaussianBlur(par["sfocatura"]))
            # method=6: encoder piu' lento, ~10% in meno a parita' di qualita'.
            ridotta.save(out, "WEBP", quality=par["qualita"], method=6)
            kb = out.stat().st_size / 1024
            totale += kb
            print(f"{out.name:34} {w}x{h:<5} {kb:6.0f} KB")
    print(f"{'totale':34} {'':11} {totale:6.0f} KB")


if __name__ == "__main__":
    main()
