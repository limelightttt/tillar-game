# Word puzzle entity

The fixtures implement the four-pictures/one-word mechanic. Every puzzle keeps
four replaceable visual descriptors, an answer, optional distractor letters,
and an educational explanation. Selectors and queue helpers accept caller-owned
arrays, so a future CMS/API adapter can replace `wordPuzzles` without changing
the game model.

This slice deliberately reuses only `QuestionCategoryId`/`CategoryId` from the
public question entity. That small same-layer coupling keeps both games on the
same category taxonomy until a backend-owned taxonomy or shared category entity
is available.
