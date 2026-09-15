# Game session model

This entity owns the in-memory Zustand model for **Two pictures**. Consumers
import its public [index.ts](index.ts); the browser singleton is
`useGameSessionStore`. Pages own routing and scheduled calls, while this entity
owns answer validation, statistics, lives, and transitions.

## State and flow

- `startSession({ categoryId, mode })` creates a fresh queue and enters `playing`.
  An empty injected category returns `false` without starting a session.
- `solo` continues until `finishSolo`; every accepted answer enters `feedback`.
  `advance` starts the next question. Errors do not remove solo lives.
- `duel-demo` is a local bot simulation. After the player's answer, further
  answers are rejected; the store stays `playing` while waiting for the bot.
  When both answers exist, a non-final round enters `round-result`.
- Both demo participants start with three lives. A wrong answer removes one
  life. Either participant reaching zero ends the duel immediately, even if
  the other has not answered. A sole survivor wins; simultaneous elimination
  falls back to correct count, then lower total response time, then draw.
- A surviving duel ends after both answers in round eight and uses the same
  correct-count/time comparison. Total response time includes wrong answers.
  Eight rounds is an implementation assumption, not a supplied round count.
- There is no player answer deadline. `tick` updates elapsed response time and
  reveals the independently scheduled bot answer. It may finish the duel.
- `finishSolo` enters `finished` with reason `manual`, including zero-answer
  sessions. It rejects idle, already finished, and duel sessions.
- `resetSession` returns to `idle` without emitting an analytics event.

`GamePage` calls `tick` every 100 ms while playing and `advance` after a 1,450 ms
round-result hold. The exit dialog does not pause those effects. Confirming solo
exit opens the result; confirming duel exit resets and returns home. Play again
starts a new session with the same category and mode. Home resets both game
stores, and reloading discards their state.

## Content and integration boundary

`createGameSessionStore({ questions, now, random, analytics })` accepts partial
dependency overrides for deterministic tests or future adapters. Defaults use
local `pictureQuestions`, `Date.now`, and `Math.random`. The entity depends on the
question entity through its public entry point.

Question order belongs to the question entity's queue: exhaust the selected pool
before repeating, and avoid repeating the previous cycle's last item at the
next cycle's start when the pool contains more than one item. New sessions start
new queues; this is not persistent cross-session history.

The optional typed analytics callback emits `session-started`,
`question-presented`, `answer-recorded`, `round-completed`, and
`session-finished`. It is an adapter seam, with no delivery transport, consent
handling, persistence, authentication, or authoritative multiplayer state.

Colocated tests cover store actions, queues in the question entity, scoring,
timer, and bot scheduling. See the [project verification guide](../../../README.md#verification)
and [implementation scope](../../../docs/IMPLEMENTATION_SCOPE.md).
