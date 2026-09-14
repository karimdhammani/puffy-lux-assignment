# Puffy Lux — Figma assignment submission

A responsive HTML, CSS, and vanilla JavaScript implementation of Karim Dhammani's Puffy Lux Hybrid assignment.

## Design reference

- [Evening skyline artboard](https://www.figma.com/design/4kqIz7r1wRHhiGfsFMSv4z?node-id=72-2458)
- [Size selection dialog](https://www.figma.com/design/4kqIz7r1wRHhiGfsFMSv4z?node-id=72-3048)

The 1440 × 900 product fold reuses the existing Puffy typography, tokens, icons, and layout. The supplied `normal.png` and `cutaway.png` replace the earlier hero with the updated, aligned image pair. The personal submission note is an addition below the original artboard. Mobile layouts adapt the desktop design.

## Run locally

```sh
python3 -m http.server 4173
```

Open http://localhost:4173. No build step or package installation is required.

## Interactions

- Select “See what's inside” to reveal the X-ray image on the right. Drag left to expose more; both images keep identical dimensions and cropping.
- The slider supports touch, pointer, arrow keys, Home (exterior), and End (interior), with reduced-motion support.
- Browse the image gallery, change the mattress size, and try the session-only prototype cart.
- The Figma link and panel submission note appear below the product fold.

The page is an independent assignment prototype. Product prices, offers, and claims reproduce the supplied design and are not a live catalog. No purchases or payments are processed. Generated cutaway imagery is illustrative.

## Publish

GitHub Pages serves the repository root on the `main` branch. All website assets are committed locally; Google Fonts supplies Mukta and PT Serif.

The X-ray view lists all eight mattress layers with published thicknesses, using the award glass treatment with a dark backing for readable text. Gallery arrows use centered SVG paths. Financing stays inline, and upgrade gifts use the same ink icon in the page and size dialog.
