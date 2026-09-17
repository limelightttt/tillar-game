# TILLAR Games — implementation scope

## What the supplied specification requires

The source document describes two independent games inside one TILLAR product:

- `Two pictures`;
- `Four pictures / word`.

Each game needs solo play and real online competition between exactly two users. Content is grouped into categories plus `all`; there are no levels or difficulty settings. A selected pool must be exhausted before its content repeats.

Production delivery also references TILLAR accounts, content administration, persistent history, and analytics. The document does not define network endpoints, schemas, identity tokens, media storage, match protocol, reconnect behavior, or analytics transport.

## Implemented browser client (`0.1.0`)

### Shared platform

- one hub and shared blue TILLAR visual system for both games, with semantic tokens in `src/app/styles/index.css`;
- mobile-first UI down to 320 px and desktop layouts;
- all ten categories plus `all`;
- solo and explicitly labelled `duel-demo` modes;
- common score, lives, timer, result, exit, and mascot presentation;
- one persistent RU/UZ/EN interface language selector across home, game, and result headers;
- no-repeat queue cycles;
- typed, replaceable content/session seams;
- typed analytics callbacks, without invented delivery endpoints.

### Game 1 — Two pictures

- complete solo loop with 14 local questions across all ten categories;
- two visual options and accessible non-color answer states;
- correct answer plus educational explanation after both correct and incorrect choices;
- complete bot-duel demonstration of three lives, eight rounds, and score/time tiebreak.

### Game 2 — Four pictures / word

- complete solo loop;
- twenty puzzles, with at least two in every category;
- four visual clues, shuffled uniquely identified letters, duplicate letters, and optional distractors;
- pointer and keyboard composition, remove, clear, and confirm actions;
- correct word plus educational explanation after every solo attempt;
- complete bot-duel demonstration with the same lives/round/result rules and no educational popup.

### Robot animation audit

- user-requested home-only hover experiment: the neutral robot wrapper moves vertically by 8 px over a 2.4 s loop, starting after 600 ms; the legs below the knees stay behind the lower card edge, softened by a gradient, with no ground shadow. The larger mascot has reserved space below the text on mobile and desktop. Reduced motion receives a static presentation without hovering. Shared action playback, source PNGs, and gameplay are unchanged;

- action names describe product intent: `celebrate` and `encourage`;
- both supplied action sequences start preparing after the first application paint, reducing the first-feedback loading delay without guaranteeing that preloading finishes before an early answer;
- active unique frames finish decoding before playback begins;
- one stable transparent canvas avoids per-frame `img.src` swaps and blank flashes;
- idle, jump, and squat assets share one square presentation stage; variable-size jump frames use one constant scale and a bottom-center pivot;
- feedback modals finish their entrance before a one-shot reaction begins, while result reactions wait for the result-card entrance;
- action sequences are one-shot and respect `prefers-reduced-motion`;
- timings are 960 ms for celebration and 3.5 s for encouragement.

The TILLAR specification does not prescribe mascot animations. Their semantic placement and choreography are UI implementation decisions approved through the product review; duel rounds still omit educational popups and mascot reactions so competition remains fast.

### Responsive UI audit

- desktop game boards keep picture choices bounded and use a compact 2×2 word-clue grid beside an equally tall answer panel; primary start/word-submit actions have bounded desktop widths, with the existing layouts below 1024 px preserved;

- desktop home layout from 1024 px uses one row for product selection, equal-height hero/setup columns, bounded headline/mascot sizes, and fully visible category choices; this is a user-requested presentation change, with mobile styles and game rules preserved;

- the home hero reserves a separate in-flow mascot region, so switching products cannot place copy beneath the robot;
- feedback and result mascots use bounded square slots instead of overflowing differently shaped source canvases;
- duel score cards stack at the 320 px baseline and return to two columns from the small breakpoint;
- dense duel result rows move response time to a second mobile row and restore the compact desktop grid at the small breakpoint.

### Navigation, localization, and persistence

- Home defaults to Game 1 / `all` / `solo` and clears both session stores on mount.
- Confirmed solo exit opens that game's result, including an empty-session result; confirmed duel exit resets the session and returns home.
- Exit confirmation does not pause the elapsed clock or the bot. Browser Back is not intercepted.
- Non-final duel rounds advance 1,450 ms after both answers. Elimination and round eight go straight to the result.
- Play again preserves category and mode but resets statistics and queue history.
- Game routes require an active session; result routes require a finished session. Reloading loses sessions, and invalid/unknown routes redirect home.
- Interface language persists in localStorage as `tillar-language` and sets the document language. Quiz text, image descriptions, and word normalization/input remain Russian.
- Vercel SPA fallback is committed in `vercel.json`; root-path hosting is assumed. Hosting configuration alone does not verify a deployment or add persistence.

### Verification boundary

- `pnpm check` runs ESLint, the FSD direction checker, Node-based Vitest tests, strict TypeScript, and the production build.
- `pnpm format:check` checks Markdown and other repository formatting separately.
- Playwright's `e2e/ui.spec.ts` has six scenarios across three Chromium viewports (320, 390, 1440 px wide), all using reduced motion. It covers home/language switching, picture solo feedback, word startup, both solo result screens, and language consistency into a game/exit dialog.
- Playwright runs separately with `pnpm test:e2e`. Home screenshot baselines are committed for Windows only; other platforms require reviewed baselines.
- Full duels, word submission, normal-motion animation, keyboard flows, restart, Back, unknown routes, and production network behavior are not covered by this browser suite. Follow the manual checklist in [AGENTS.md](../AGENTS.md#testing-and-verification).
- There is no committed GitHub Actions workflow or evidence here of production-environment QA. Descriptions of implemented UI behavior above are not a claim that every manual scenario has been verified.

## Explicit backend boundary

The bot duel is not real multiplayer. Production integration needs confirmed TILLAR contracts for:

- identity, authorization, and account session;
- matchmaking for exactly two people;
- authoritative WebSocket match state, clocks, reconnects, and anti-cheat behavior;
- content/CMS CRUD, roles, media upload, publication, hiding, and ordering;
- persistent results and question history across devices;
- analytics transport, consent, metric definitions, and retention;
- localized quiz/CMS content and its language fallback contract.

Until those contracts exist, adding guessed `fetch` URLs or a made-up database schema would create incompatible product behavior. Current fixtures are valid offline content and are isolated so a confirmed API/CMS adapter can replace them.

## Deliberate assumptions

- A bot is used only to demonstrate specified duel rules.
- The demo has eight rounds; the specification does not give a count.
- A wrong answer costs one life and closes that player's attempt for the current round.
- Zero lives ends the duel without waiting for the other answer. A sole survivor wins; simultaneous elimination or surviving eight rounds uses correct count, then total response time over all recorded answers, then draw.
- No answer deadline is imposed.
- The interface supports Russian, Uzbek, and English; local question and puzzle fixtures remain authored Russian content.
- Audio is deferred until assets, licensing, volume rules, and product approval are available.

## Before production handoff

1. Confirm backend and CMS contracts.
2. Confirm production visual tokens and approved media. Game 2 can use its existing `WordPuzzleImage.src`; Game 1 requires an approved `QuestionOption` schema and renderer extension because it currently has only typed SVG `visualKey` values. Neither game implements media upload/storage.
3. Implement real accounts and two-user matches separately from `duel-demo`.
4. Connect analytics callbacks to the approved transport.
5. Run device/browser, keyboard, screen-reader, network-failure, and reconnect QA against the production environment.

## Home embedding layout

The home page omits the branded top header and the TILLAR GAMES eyebrow
for iframe integration. The language selector sits in the upper-right corner of the robot
intro card, independently of the game selection heading. Game and result screens also omit the branded header and language selector.
The finish-game button remains within the game content with its existing confirmation flow.
