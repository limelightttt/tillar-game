# Word game session

This entity owns the in-memory Zustand model for **Four pictures / word**,
independently of Game 1. Consumers use the public [index.ts](index.ts) and browser
singleton `useWordGameSessionStore`. Domain transitions stay here; pages own
routing and scheduled calls.

## State and flow

- `startSession({ categoryId, mode })` creates a fresh puzzle queue and shuffled
  letter tiles, then enters `playing`. An empty category returns `false`.
- `selectTile`, `removeTile`, and `clearSelection` edit the selection only while
  playing and before submission. Unavailable/duplicate tiles and selections
  longer than the normalized answer are rejected.
- `submitAnswer` requires exactly the answer's normalized letter count and
  accepts only one attempt per round. Correctness belongs to word-puzzle helpers.
- Solo enters `feedback` with the submitted word, correct word, correctness,
  and educational explanation. `advance` draws the next puzzle; errors do not
  remove lives. `finishSolo` ends the session, even with zero answers.
- `duel-demo` is a local bot simulation without educational feedback. Both
  participants start with three lives; a wrong answer removes one life.
- Either participant reaching zero ends the duel without waiting for the other
  answer. A sole survivor wins; simultaneous elimination uses correct count,
  then lower total response time over all recorded answers, then draw.
- If both survive, non-final rounds enter `round-result` once both answers exist.
  Round eight ends with the same correct-count/time comparison. Eight rounds is
  an implementation assumption because the specification provides no count.
- `tick` measures elapsed time and reveals the scheduled bot answer; there is no
  player answer deadline. `resetSession` clears state without an analytics event.

`WordGamePage` calls `tick` every 100 ms while playing and `advance` after a
1,450 ms round-result hold. The exit dialog does not pause these effects.
Confirmed solo exit opens the result; confirmed duel exit resets and returns
home. Play again keeps category/mode but starts a new queue. Home resets both
stores; no session survives a reload.

## Content and integration boundary

`createWordGameSessionStore({ puzzles, now, random, analytics })` accepts partial
dependency overrides. Defaults use local `wordPuzzles`, `Date.now`, and
`Math.random`. The store uses the public word-puzzle entity for content, queues,
and letters, and the public question entity for the shared category type.

Queue exhaustion and the no-repeat boundary between cycles apply within the
current session, including injected content. Each next puzzle gets a fresh
selection and letter set. There is no cross-session content history.

The optional analytics callback emits `session-started`, `puzzle-presented`,
`answer-recorded`, `round-completed`, and `session-finished`. It does not implement
transport, consent, persistence, authentication, or real matchmaking.

Colocated tests cover transitions, invalid actions, scoring, timers, bot behavior,
and analytics. See the [project verification guide](../../../README.md#verification)
and [implementation scope](../../../docs/IMPLEMENTATION_SCOPE.md).
