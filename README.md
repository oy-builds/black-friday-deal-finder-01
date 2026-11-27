[![DealCheck Black Friday deal finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/oy-builds/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/oy-builds/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

# DealCheck — Black Friday 2026 price-checked deals

A static deal-finder site of 30 real Black Friday / Cyber Monday deals, each price checked by hand on 27 November 2026 from the named store or a deals report that names the store. Every deal shows the product, store, sale price, usual price, discount, a link to the store, the check time and source — plus an honest verdict: **NEW LOW** (lowest price tracked), **STRONG PRICE** (a genuine cut), or **ROUTINE SALE** (the discount is real but the "was" price is inflated or the price was this low before).

## What it does

- **Search** — find a product, brand or store (press `/` to jump to the box).
- **Filters** — category chips, store picker, minimum discount, and a "new lows only" switch.
- **Sorting** — best deal first (a score from discount % plus a verdict bonus), biggest % off, biggest $ saving, lowest or highest price.
- **Verdict evidence** — each card says why the deal earned its verdict, with the source and check time.
- **Phone layout** — single-column cards under 560px wide.
- **Shareable views** — a filter state lives in the URL hash, e.g. `#q=airpods`, `#cat=TVs`, `#lows=1`, `#sort=discount`.

## Run it

Serve `app/` with any static server, for example:

```sh
python3 -m http.server 8123 --directory app
# open http://localhost:8123
```

No build step, no network requests, no tracking.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`.
