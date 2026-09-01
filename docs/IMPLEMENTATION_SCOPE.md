# TILLAR Games — implementation scope

## What the supplied specification requires

The source document describes two independent games inside one TILLAR product:

- `Two pictures`;
- `Four pictures / word`.

Each game needs solo play and real online competition between exactly two users. Content is grouped into categories plus `all`; there are no levels or difficulty settings. A selected pool must be exhausted before its content repeats.

Production delivery also references TILLAR accounts, content administration, persistent history, and analytics. The document does not define network endpoints, schemas, identity tokens, media storage, match protocol, reconnect behavior, or analytics transport.

## Implemented browser release

### Shared platform

- one hub and approved visual system for both games;
- mobile-first UI down to 320 px and desktop layouts;
- all ten categories plus `all`;
- solo and explicitly labelled `duel-demo` modes;
- common score, lives, timer, result, exit, and mascot presentation;
- one persistent RU/UZ/EN interface language selector across home, game, and result headers;
- no-repeat queue cycles;
- typed, replaceable content/session seams;
- typed analytics callbacks, without invented delivery endpoints.

### Game 1 — Two pictures

- complete solo loop;
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

- action names describe product intent: `celebrate` and `encourage`;
- both supplied action sequences start preparing after the first application paint, eliminating the first-error network/decode stall in the normal flow;
- active unique frames finish decoding before playback begins;
- one stable transparent canvas avoids per-frame `img.src` swaps and blank flashes;
- idle, jump, and squat assets share one square presentation stage; variable-size jump frames use one constant scale and a bottom-center pivot;
- feedback modals finish their entrance before a one-shot reaction begins, while result reactions wait for the result-card entrance;
- action sequences are one-shot and respect `prefers-reduced-motion`;
- timings are 960 ms for celebration and 3.5 s for encouragement.

The TILLAR specification does not prescribe mascot animations. Their semantic placement and choreography are UI implementation decisions approved through the product review; duel rounds still omit educational popups and mascot reactions so competition remains fast.

### Responsive UI audit

- the home hero reserves a separate in-flow mascot region, so switching products cannot place copy beneath the robot;
- feedback and result mascots use bounded square slots instead of overflowing differently shaped source canvases;
- duel score cards stack at the 320 px baseline and return to two columns from the small breakpoint;
- dense duel result rows move response time to a second mobile row and restore the compact desktop grid at the small breakpoint.

## Explicit backend boundary

The bot duel is not real multiplayer. Production integration needs confirmed TILLAR contracts for:

- identity, authorization, and account session;
- matchmaking for exactly two people;
- authoritative WebSocket match state, clocks, reconnects, and anti-cheat behavior;
- content/CMS CRUD, roles, media upload, publication, hiding, and ordering;
- persistent results and question history across devices;
- analytics transport, consent, metric definitions, and retention;
- final design tokens;
- localized quiz/CMS content and its language fallback contract.

Until those contracts exist, adding guessed `fetch` URLs or a made-up database schema would create incompatible product behavior. Current fixtures are valid offline content and are isolated so a confirmed API/CMS adapter can replace them.

## Deliberate assumptions

- A bot is used only to demonstrate specified duel rules.
- The demo has eight rounds; the specification does not give a count.
- A wrong answer costs one life and closes that player's attempt for the current round.
- A player at zero lives loses immediately. Otherwise correct count wins, then total response time, then draw.
- No answer deadline is imposed.
- The interface supports Russian, Uzbek, and English; local question and puzzle fixtures remain authored Russian content.
- Audio is deferred until assets, licensing, volume rules, and product approval are available.

## Before production handoff

1. Confirm backend and CMS contracts.
2. Replace or augment local clue art with approved TILLAR media through the existing `src` field/adapter boundary.
3. Implement real accounts and two-user matches separately from `duel-demo`.
4. Connect analytics callbacks to the approved transport.
5. Run device/browser, keyboard, screen-reader, network-failure, and reconnect QA against the production environment.
