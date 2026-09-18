# Puffy Lux

A responsive HTML, CSS, and vanilla JavaScript product-page prototype.

## Overview

The page includes responsive layouts, an interactive X-ray reveal, gallery controls, size selection, and a session-only prototype cart.

## Run locally

```sh
python3 -m http.server 4173
```

Open http://localhost:4173. No build step or package installation is required.

## Interactions

- Select “See what's inside” to reveal the X-ray image on the right. Drag left to expose more; both images keep identical dimensions and cropping.
- The slider supports touch, pointer, arrow keys, Home (exterior), and End (interior), with reduced-motion support.
- Browse the image gallery, change the mattress size, and try the session-only prototype cart.
- The panel submission note appears below the product fold.

The page is an independent prototype. Product prices, offers, and claims are not a live catalog. No purchases or payments are processed.

## Publish

GitHub Pages serves the repository root on the `main` branch. All website assets are committed locally; Google Fonts supplies Mukta and PT Serif.
