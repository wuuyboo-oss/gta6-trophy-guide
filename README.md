[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/competitions/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/wuuyboo-oss/gta6-trophy-guide/rank.svg)](https://make.fun/competitions/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/wuuyboo-oss/gta6-trophy-guide/reward.svg)](https://make.fun/competitions/gta6-trophy-guide-01)

# Leonida Trophy Guide — GTA 6 Platinum Tracker

An offline guide and tracker for all **55 Grand Theft Auto VI PlayStation 5 trophies** (1 Platinum, 2 Gold, 6 Silver, 46 Bronze, 0 online). Built for the [make.fun gta6-trophy-guide-01 bounty](https://make.fun/competitions/gta6-trophy-guide-01).

## What it does

- **Every trophy** with its official name, description and grade as PlayStation publishes them, plus a guide in our own words that names its sources (PowerPyx, KeenGamer, gtaspotter, gamemapa).
- **Checklist tracker** — tick trophies off; progress is saved in localStorage, with a progress bar and per-grade counts.
- **Export / import** — download progress as a `.json` file and import it back on any device.
- **Filters** — by kind (story, missable, collectibles, activities), by grade, by earned state, and by free-text search.
- **Spoiler-safe setting** — hides story trophies' names and descriptions until they are earned.
- **Platinum roadmap** — the order to earn them in: story first, then collectibles, activities, heists and the 100% cleanup, built from the official descriptions (chapters, missions, collectibles and counts).
- **Missable flags** — Positive Mental Attitude is the only trophy that can be missed (meditate at the Chapter 1 spot before leaving Chapter 1). Five hidden trophies have no confirmed method yet; the guide says so honestly instead of inventing one.

## Run it

No build step, no network at run time — every file is local, system fonts only.

```sh
node serve.ts
# open http://localhost:8080
```

Or serve `app/` with any static file server and open `app/index.html`.

## Layout

- `app/index.html`, `app/style.css` — page and design
- `app/app.js` — entry module wiring the views together
- `app/modules/` — `trophyStore.js` (data + localStorage + export/import), `trophyFilters.js` (kind/grade/search/spoiler), `checklistView.js`, `roadmapView.js`, `detailView.js`
- `app/data/trophies.json` — the 55 trophies with official names, descriptions, grades, hidden flags, counts and cited guides
- `app/data/roadmap.json` — the platinum roadmap stages and ground rules
- `main.ts` — hands the guide in (copies `app/` + `screenshots/` to `/output` and writes `dossier.json`)
- `screenshots/` — renders of the guide in a desktop browser

## Sources

Official names, descriptions and grades are quoted as PlayStation publishes them (collected by PSNProfiles, TrueAchievements and Exophase). Guide facts come from PowerPyx, KeenGamer, gtaspotter and gamemapa, named beside each trophy's guide. An unofficial fan guide, not affiliated with Rockstar Games or PlayStation; no game artwork or logos are used.

## License

MIT — see [LICENSE](LICENSE).
