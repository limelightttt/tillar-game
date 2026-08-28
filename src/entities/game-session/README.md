# Game session model

This slice is an in-memory model for the Game 1 vertical slice.

- `solo` is endless until `finishSolo`; every submitted answer enters the
  educational `feedback` state.
- `duel-demo` is explicitly a local bot simulation, not online multiplayer.
  A round enters `round-result` only after both answers are available.
- Both demo participants start with three lives. The duel ends immediately
  after either participant's third error or after round 8. The sole survivor
  wins an elimination; simultaneous elimination falls back to correct-answer
  count, then lower total response time, with exact equality as a draw.
- The specification has no player answer deadline. `tick` only updates elapsed
  response time and reveals the scheduled demo-bot answer.
- Question order is delegated to the question entity's cycle queue, so a
  selected pool is exhausted before a question can repeat.

The optional typed analytics callback is only an adapter seam. The model does
not send data, persist state, authenticate users, or claim authoritative
multiplayer behaviour.
