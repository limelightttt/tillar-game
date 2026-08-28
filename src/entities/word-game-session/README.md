# Word game session

This in-memory Zustand slice runs the four-pictures/one-word game independently
from Game 1.

- Solo continues until `finishSolo` and shows answer, correctness, and the
  educational explanation after every submitted word.
- `duel-demo` is a local bot simulation, never real multiplayer. Both players
  start with three lives; a wrong word removes one life. A sole survivor wins
  immediately, while simultaneous elimination falls back to score and total
  response time.
- A surviving duel ends after eight rounds. Correct answers decide the winner,
  then lower total response time; exact equality is a draw.
- The player has no answer deadline. `tick` measures elapsed time and reveals
  the independently scheduled demo-bot answer.

Fixtures are injected through `createWordGameSessionStore({ puzzles })`, so a
future content adapter can replace them without adding server state to Zustand.
The optional typed `analytics` callback reports domain events only; this slice
does not choose or implement a transport.
