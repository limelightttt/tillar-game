# TILLAR Games

Browser client for two intellectual games from the TILLAR specification:

1. **Two pictures** — choose the correct illustration.
2. **Four pictures / word** — find the common idea and compose the answer from shuffled letters.

Both games share one responsive platform shell, category selector, solo mode, clearly labelled bot-duel demo, score UI, educational feedback, results, and the supplied TILLAR robot animations.

## Implemented product flow

- one hub for choosing either game, a category, and a mode;
- a persistent Russian, Uzbek, and English interface selector shared by every header;
- all ten content categories plus `all`, with no difficulty levels;
- queue cycles without repetition until the selected pool is exhausted;
- Game 1: two accessible code-native illustrations and one-choice answering;
- Game 2: four visual clues, unique letter-tile identities, optional extra letters, remove/clear/keyboard input, and word confirmation;
- solo feedback after every answer, including the correct answer and an educational explanation;
- bot duel demonstrating three lives, eight rounds, score and response-time tiebreak rules, without educational popups;
- common result UI and typed analytics seams for both games;
- mobile-first layout from 320 px, visible focus states, 44 px targets, reduced-motion handling, and scroll-safe dialogs;
- semantic robot states: `idle`, `celebrate`, and `encourage`, with action frames prepared after the first paint and rendered only after decoding to prevent delayed first reactions and blank-frame flicker;
- one square mascot viewport across idle, success, error, and result contexts, so differently cropped source sequences keep a consistent visual size on mobile and desktop.

The browser client is fully usable from local content. Real two-user online play is **not** simulated or presented as production multiplayer.

## Content and backend boundary

Questions and word puzzles currently live in replaceable entity fixtures:

- `src/entities/question`;
- `src/entities/word-puzzle`.

The word-image model accepts either the local visual fallback or a future CMS media URL. Session stores accept injected content and analytics callbacks, so an API adapter can replace fixtures without rewriting the game UI.

No TILLAR API contract was supplied. Therefore this repository does not invent endpoints for accounts, matchmaking, WebSockets, CMS CRUD, persistence, or analytics transport. Those production integrations are listed in [`docs/IMPLEMENTATION_SCOPE.md`](docs/IMPLEMENTATION_SCOPE.md).

## Stack

- React 19, strict TypeScript, Vite, pnpm;
- Feature-Sliced Design (`app → pages → widgets → features → entities → shared`);
- Tailwind CSS 4;
- Zustand for in-memory active sessions;
- React Router;
- a typed dependency-free i18n layer in `src/shared/config/i18n`;
- Vitest;
- ESLint, Prettier, and the local FSD direction checker.

No dependency was added for the second game. Three.js remains intentionally absent: the supplied robot is a 2D PNG sequence, not a 3D model.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Verification

```bash
pnpm check
```

This runs lint, FSD validation, all unit/smoke tests, strict TypeScript, and the production build.

## Product assumptions requiring confirmation

- Bot duels use eight rounds because the specification does not define a multiplayer round count.
- A wrong duel answer ends that player's attempt for the round and costs one life.
- Zero lives ends the duel; otherwise the higher correct count wins, then lower total response time, then draw.
- There is no answer deadline because the specification does not define one.
- The interface is localized in Russian, Uzbek, and English. Authored quiz content remains Russian until localized CMS content is approved.
- Sounds are intentionally out of the current scope and should be added only after the sound set and product rules are approved.

## Robot assets

Runtime assets are copied from the supplied archives and kept as transparent 2D PNG frames:

- `celebrate`: eight jump frames, 960 ms total;
- `encourage`: the authored 70-slot squat/smile timeline, 3.5 s total;
- `idle`: one static neutral frame; no loop or invented floating motion.

The renderer prepares the two action sequences in the background after the first application paint, keeps a stable poster until every active frame is decoded, and then draws to one fixed transparent canvas. A shared `512×512` presentation stage normalizes the taller jump crops without distorting them. Poster and canvas visibility are mutually exclusive, actions are one-shot, and reduced-motion users receive only the configured static frame without downloading the action sequences during application startup.
