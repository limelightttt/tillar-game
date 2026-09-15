# TILLAR Games

Browser client for two intellectual games from the TILLAR specification:

1. **Two pictures** — choose the correct illustration.
2. **Four pictures / word** — find the common idea and compose the answer from shuffled letters.

Current version: **0.1.0**, a pre-production browser client with local content.

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
- semantic robot states: `idle`, `celebrate`, and `encourage`, with action frames prepared after the first paint and rendered only after decoding to reduce initial loading delays and avoid blank-frame flicker;
- one square mascot viewport across idle, success, error, and result contexts, so differently cropped source sequences keep a consistent visual size on mobile and desktop.

The browser client is usable with bundled local content. `duel-demo` is a local bot simulation; real two-user online play remains backend-dependent.

## Content and backend boundary

Questions and word puzzles currently live in replaceable entity fixtures:

- `src/entities/question`;
- `src/entities/word-puzzle`.

Game 1 has 14 questions; Game 2 has 20 puzzles, two per category. Game 1 uses typed SVG `visualKey` values and has no remote media URL field. The word-image model already accepts `src` or a local symbol fallback; it does not implement CMS upload or a network-error fallback. Session stores accept injected content and analytics callbacks, so an API adapter can replace fixtures without rewriting the game UI.

No TILLAR API contract was supplied. Therefore this repository does not invent endpoints for accounts, matchmaking, WebSockets, CMS CRUD, persistence, or analytics transport. Those production integrations are listed in [`docs/IMPLEMENTATION_SCOPE.md`](docs/IMPLEMENTATION_SCOPE.md).

## Stack

- React 19, strict TypeScript, Vite, pnpm;
- Feature-Sliced Design (`app → pages → widgets → features → entities → shared`);
- Tailwind CSS 4;
- Zustand for in-memory active sessions;
- React Router;
- a typed dependency-free i18n layer in `src/shared/config/i18n`;
- Vitest for domain and static-render smoke tests;
- Playwright for Chromium UI flows and visual snapshots;
- ESLint, Prettier, and the local FSD direction checker.

The UI uses handwritten shared components and native dialogs. The supplied robot is a 2D PNG sequence.

## Run locally

Requirements: Node.js `>=22.12.0`, pnpm `>=10.0.0`; the repository pins `pnpm@10.33.0`. Use pnpm for all project commands.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173). Vite binds to `0.0.0.0` with fixed port `5173` and fails if that port is occupied. No environment variables or backend credentials are required for the current local-content client.

## Navigation and session lifecycle

| Route                              | Purpose                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `/`                                | Choose product, category, and mode; defaults to Two pictures / all / solo. |
| `/game`                            | Play Two pictures.                                                         |
| `/result`                          | Two pictures result.                                                       |
| `/games/four-pictures-word`        | Play Four pictures / word.                                                 |
| `/games/four-pictures-word/result` | Four pictures / word result.                                               |

Solo repeats answer → educational feedback → Continue until the player confirms Finish game. Finishing opens the result even if no answer was submitted. In a duel demo, each player has one attempt per round; after both answers, non-final rounds advance automatically after 1.45 seconds. Elimination or completion of round eight opens the result. Leaving a duel through the exit dialog discards it and returns home. Opening that dialog does not pause the clock or bot.

Play again keeps the product, category, and mode but creates a new session and queue. Returning home resets both sessions; reloading loses all session state. Game/result links without the required in-memory state and unknown routes redirect home. Browser Back to home resets sessions without an exit confirmation.

The language selector saves `ru`, `uz`, or `en` in localStorage (`tillar-language`) and updates the document language. Russian is the default. Quiz text and answers stay Russian in every interface language. In the focused word composer, Russian letter keys select available tiles and Backspace removes the last selection; submit a complete word with the confirmation button.

## Build and hosting

```bash
pnpm build
pnpm preview
```

The build runs strict TypeScript checks and writes the static application to `dist/`. The repository includes `vercel.json` with an SPA rewrite to `/index.html`, allowing React Router to handle direct route requests. For a Vercel project, use pnpm to install, `pnpm build` to build, and `dist` as the output directory. Other static hosts need an equivalent fallback for client routes.

Routes and robot URLs currently assume deployment at the domain root: BrowserRouter has no `basename`, and Vite has no custom `base`. TypeScript's `baseUrl` in `tsconfig.app.json` configures module resolution; it is not a hosting URL. This configuration does not establish a verified deployment URL or production release.

## Verification

```bash
pnpm check
```

This runs ESLint, the FSD direction checker, Vitest unit/static-render smoke tests, strict TypeScript, and the production build. It does not run Playwright or the repository-wide `pnpm format:check`. The FSD checker verifies upward layer imports; public entry points and same-layer coupling still need review.

Additional commands:

| Command                         | Purpose                                                  |
| ------------------------------- | -------------------------------------------------------- |
| `pnpm lint`                     | ESLint, import order, and source formatting integration. |
| `pnpm check:fsd`                | Check layer dependency direction.                        |
| `pnpm test` / `pnpm test:watch` | Single Vitest run / watch mode.                          |
| `pnpm format:check`             | Check repository formatting, including Markdown.         |
| `pnpm format`                   | Intentionally format files.                              |
| `pnpm test:e2e`                 | Run the separate Playwright suite.                       |
| `pnpm test:e2e:update`          | Intentionally regenerate visual baselines after review.  |

### Browser checks

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

Corepack must be available because Playwright's web-server command uses `corepack pnpm exec vite`. The suite uses `http://127.0.0.1:5173`, starts Vite, and may reuse an existing server outside CI.

Six scenarios run at 320×740, 390×844, and 1440×1000 in Chromium, always with reduced motion: home layout and three interface languages, picture-game solo feedback, word-game startup, both solo result pages, and language consistency into a game/exit dialog. Home has screenshot assertions; committed baselines are Windows-specific. macOS/Linux runs need their own reviewed baselines, so a missing snapshot is not evidence of a UI regression. Reports and traces are written to ignored `playwright-report/` and `test-results/`.

The suite does not cover full duel flows, word submission, normal-motion animation, keyboard operation, restart, browser Back, or unknown routes. The manual verification checklist is in [AGENTS.md](AGENTS.md#testing-and-verification). No GitHub Actions workflow is committed.

## Product assumptions requiring confirmation

- Bot duels use eight rounds because the specification does not define a multiplayer round count.
- A wrong duel answer ends that player's attempt for the round and costs one life.
- Zero lives ends the duel immediately. A sole survivor wins; simultaneous elimination or surviving round eight uses correct count, then lower total response time over all recorded answers, then draw.
- There is no answer deadline because the specification does not define one.
- The interface is localized in Russian, Uzbek, and English. Authored quiz content remains Russian until localized CMS content is approved.
- Sounds are intentionally out of the current scope and should be added only after the sound set and product rules are approved.

## Robot assets

Runtime assets are copied from the supplied archives and kept as transparent 2D PNG frames:

- `celebrate`: eight jump frames, 960 ms total;
- `encourage`: the authored 70-slot squat/smile timeline, 3.5 s total;
- `idle`: one static neutral frame. The home hero wraps it in a gentle CSS hover cycle (8 px / 2.4 s, with legs below the knees cropped behind the card edge), enabled only with normal motion; shared idle rendering stays static, and result reactions remain unchanged.

The renderer prepares the two action sequences in the background after the first application paint, keeps a stable poster until every active frame is decoded, and then draws to one fixed transparent canvas. A shared `512×512` presentation stage normalizes the taller jump crops without distorting them. Poster and canvas visibility are mutually exclusive, actions are one-shot, and reduced-motion users receive only the configured static frame without downloading the action sequences during application startup.

## Documentation map

- [AGENTS.md](AGENTS.md): maintenance rules, architecture, routes, and verification checklist.
- [Implementation scope](docs/IMPLEMENTATION_SCOPE.md): specification requirements, implemented behavior, assumptions, and integration gaps.
- [Game 1 session](src/entities/game-session/README.md): picture-game state and rules.
- [Word puzzle content](src/entities/word-puzzle/README.md): fixture/media model, letters, and queues.
- [Game 2 session](src/entities/word-game-session/README.md): word-game state and rules.

The GitHub repository overview renders this README. Keep documentation changes in the same repository so the overview and local instructions stay in sync.
