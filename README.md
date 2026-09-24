# AetherSync — Offline Astronaut Health Console

A front-end prototype built for the 2026 NASA Space Apps Challenge (Human Exploration / Software).
Long-duration missions expose astronauts to radiation, isolation, altered gravity, and a hostile
closed environment. AetherSync helps astronauts gather health indicators, evaluate their status
against a personalized baseline, and act — even with no live connection to Earth.

## Pages / Interfaces

| File | Purpose | Login required? |
|---|---|---|
| `index.html` | Crew login (Crew ID + passcode) | — |
| `baseline.html` | First-login onboarding: records each astronaut's starting personal baseline | Yes |
| `dashboard.html` | Vitals vs. personal baseline, status, daily check-in, novel-event watch, indexed log | Yes |
| `chatbot.html` | Offline AI health assistant — answers from a local trusted knowledge base, cites its source, and honestly reports `NOT_FOUND` instead of guessing | No — open to anyone |

## Notes on this prototype

- **Authentication is simulated** with `localStorage` for demo purposes only (any non-empty
  Crew ID + passcode is accepted). Swap `AS.login()` in `assets/app.js` for a real auth
  service before any real deployment.
- **The offline chatbot** matches questions against a small local keyword-indexed knowledge
  base (`assets/app.js`) — no external API calls, so it works with zero connectivity, matching
  the mission's offline-first design.
- **Baseline & check-in data** persist per Crew ID in the browser's `localStorage`, standing in
  for onboard indexed storage in this prototype.
- Colors, type, and layout are shared via `assets/style.css` so every page stays visually consistent.

## Running locally

No build step — just open `index.html` in a browser, or serve the folder with any static
file server (e.g. `npx serve .` or GitHub Pages).

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo settings, enable **Pages** → source: `main` branch, root folder.
3. Your app will be live at `https://<username>.github.io/<repo-name>/`.
