# RecallBook — explainer site

A standalone marketing/explainer page for **RecallBook**, the patient recall
engine for dentists and small clinics.

> **Patients that come back on time.** — pricing on discovery, subscription basis

This is *not* the product UI. It is a polished, self-contained landing page that
makes the idea instantly clear to a non-technical clinic owner and to an investor
skimming for 30 seconds.

## What the product does

Cleanings, refills, vaccinations and checkups all repeat on a schedule, yet the
follow-up is still left to a register and someone's memory. RecallBook turns
every follow-up into a dated recall and runs the loop:

- **Four recall types** — dental cleanings, medicine refills, vaccinations and
  checkups, each with its own default interval, overridable per patient.
- **Due-window board** — every open recall sorted into due-today, this-week and
  overdue, most-overdue first, with a breakdown by type.
- **WhatsApp recall messages** — a personalised message drafted per patient
  (name, type, due date) and staged in the outbox to send from your own number.
- **Mark done → auto-next** — close a recall and the next of that type is
  scheduled automatically at the interval, so no patient falls off the cadence.
- **Per-patient recall history** — every past and upcoming recall for a patient,
  with add / send / mark-done in one place.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup — all sections, inline SVG only. |
| `styles.css` | All styling. Palette built around the emerald accent `#059669`. |
| `app.js` | Sticky-nav highlight, smooth scroll, and the animated hero "recall board" that runs the due → sent → done loop. No dependencies. |
| `favicon.svg` | Recall-check mark. |
| `og.svg` / `og.png` | 1200×630 social preview image (PNG rasterised from the SVG). |

## Design notes

- Palette: emerald accent `#059669`, deep green-black ink, clinical off-white
  paper, a muted mint tint, amber for due-today and a clinical red for overdue.
- **Signature:** dates and counts are always set in tabular monospace, so the
  whole page reads like a clinic's recall register. The hero widget is a live
  recall board where a due-today cleaning visibly moves due → recall sent → done
  and the next one auto-schedules.
- Fully self-contained: no CDNs, no external fonts, images or scripts. System
  font stack only. Renders correctly opened as a local `file://` and deploys to
  any static host unchanged.
- Responsive down to mobile with no horizontal page scroll; the wide dashboard
  table scrolls inside its own container.
- Respects `prefers-reduced-motion` (the hero animation freezes on its end-state).

## Run it

Just open `index.html` in a browser. No build step. To serve locally:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Pushed to GitHub Pages via `.github/workflows/deploy-pages.yml` (GitHub Actions).
The folder is also a plain static site — upload it to any static host (Netlify,
Cloudflare Pages, S3) with no configuration.

---

A **KARYA** studio build · sreeni.nintendo@gmail.com
