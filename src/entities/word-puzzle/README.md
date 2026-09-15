# Word puzzle entity

This entity owns content, queue helpers, letter operations, and clue artwork for
**Four pictures / word**. Consumers import the public [index.ts](index.ts).

## Content and media

`wordPuzzles` contains 20 Russian puzzles, two in each of the ten categories.
Every `WordPuzzle` contains a stable ID, category, prompt, exactly four image
descriptors, an answer, optional distractor letters, and an educational
explanation. Category `all` selects the complete pool.

`WordPuzzleImage` has `id`, `visualKey`, `alt`, optional `symbol`, and optional
`src`. `WordPuzzleArtwork` uses `src` when present; otherwise it renders the local
symbol (or `✦`). `visualKey` selects a decorative theme. This is a rendering
seam, not a CMS/media-storage integration; a failed `src` does not automatically
switch to the symbol. Image descriptions remain authored Russian content even
when surrounding interface labels change language.

Keep IDs stable and unique, four clues per puzzle, category coverage, and
answer/explanation consistency. Visible captions and accessible descriptions
must not disclose the answer. Fixture tests validate current content invariants.

## Letters and queues

- `normalizeWord` applies NFC, Russian uppercase, and retains only `А–Я` and `Ё`.
  Spaces and hyphens do not produce tiles; `Ё` remains distinct from `Е`.
- `isCorrectWord` rejects empty input and characters outside Russian letters,
  whitespace, and hyphens, then compares normalized words.
- `createLetterTiles` shuffles answer letters plus optional distractors. Each
  tile has an independent ID, so repeated letters can be selected separately.
- Selection helpers reject unavailable/reused tiles and honor the maximum word
  length. UI keyboard handling belongs to `features/compose-word`.
- The queue exhausts the selected pool before reshuffling. With more than one
  item, the next cycle cannot start with the previous cycle's last puzzle.
  A new session starts a new queue without persistent history.

Selectors and queue helpers accept caller-owned arrays, so a confirmed CMS/API
adapter can replace fixtures. Non-Russian content requires an approved language
contract and changes to normalization, validation, and keyboard input; switching
the interface language alone does not enable localized puzzle answers.

The entity reuses `QuestionCategoryId` in its model and `CategoryId` in selectors
from the public question entity to preserve the common category taxonomy. It
contains no game-session state or network fetching.

Colocated tests cover fixtures, queue cycles, normalization, duplicate letters,
and selection helpers. See the [implementation scope](../../../docs/IMPLEMENTATION_SCOPE.md)
for the remaining production integrations.
