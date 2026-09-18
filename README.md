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

## Simple analytics

- Dashboard: https://karimdhammani.github.io/puffy-lux-assignment/stats.html
- Tracking starts on 18 September 2026. There is no historical website traffic data from before installation.
- `analytics.js` records one visible page visit per tab session using Hits Counter. No account, API key, payment, or maintenance job is required. Counts and daily history are public, approximate, and cannot identify people or employers.
- Opening the dashboard excludes subsequent assignment visits in that browser using a local preference. The dashboard itself never increments the counter. `?analytics=off` also excludes an assignment visit; `?analytics=on` clears that preference. Storage restrictions can prevent persistence and session deduplication.
- Local previews, Do Not Track, and Global Privacy Control are excluded. There are no cross-site identifiers; requests omit credentials and referrers and send only the fixed public assignment URL. The counter provider receives normal network information such as IP addresses and may log requests. No third-party JavaScript is executed.
- Reads use `/api/history`, never the incrementing `/api/hit` endpoint. UTC is used consistently. The unlisted dashboard has `noindex`; this is not authentication.
- Service outages and blockers can undercount; repeat sessions, bots, and requests made directly to the public counter endpoint can overcount. No claim is made that a count proves a panel review.
