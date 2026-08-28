import type { QuestionId } from "./types";

export type RandomSource = () => number;

export interface QuestionQueue {
  readonly pool: readonly QuestionId[];
  readonly remaining: readonly QuestionId[];
  readonly lastQuestionId: QuestionId | null;
  readonly cycle: number;
}

export interface CreateQuestionQueueOptions {
  readonly previousQuestionId?: QuestionId | null;
  readonly random?: RandomSource;
}

export interface TakeNextQuestionResult {
  readonly questionId: QuestionId | null;
  readonly queue: QuestionQueue;
}

function uniqueQuestionIds(questionIds: readonly QuestionId[]): QuestionId[] {
  return [...new Set(questionIds)];
}

function randomIndex(random: RandomSource, upperBound: number): number {
  const value = random();
  const normalizedValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), 0.999999999) : 0;

  return Math.floor(normalizedValue * upperBound);
}

export function buildQuestionCycle(
  questionIds: readonly QuestionId[],
  previousQuestionId: QuestionId | null = null,
  random: RandomSource = Math.random,
): QuestionId[] {
  const shuffledIds = uniqueQuestionIds(questionIds);

  for (let index = shuffledIds.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(random, index + 1);
    [shuffledIds[index], shuffledIds[swapIndex]] = [shuffledIds[swapIndex], shuffledIds[index]];
  }

  if (shuffledIds.length > 1 && shuffledIds[0] === previousQuestionId) {
    const replacementIndex = shuffledIds.findIndex(
      (questionId) => questionId !== previousQuestionId,
    );
    [shuffledIds[0], shuffledIds[replacementIndex]] = [
      shuffledIds[replacementIndex],
      shuffledIds[0],
    ];
  }

  return shuffledIds;
}

export function createQuestionQueue(
  questionIds: readonly QuestionId[],
  options: CreateQuestionQueueOptions = {},
): QuestionQueue {
  const pool = uniqueQuestionIds(questionIds);
  const previousQuestionId = options.previousQuestionId ?? null;

  return {
    pool,
    remaining: buildQuestionCycle(pool, previousQuestionId, options.random),
    lastQuestionId: previousQuestionId,
    cycle: 0,
  };
}

export function takeNextQuestion(
  queue: QuestionQueue,
  random: RandomSource = Math.random,
): TakeNextQuestionResult {
  const startsNewCycle = queue.remaining.length === 0;
  const remaining = startsNewCycle
    ? buildQuestionCycle(queue.pool, queue.lastQuestionId, random)
    : [...queue.remaining];
  const [questionId, ...nextRemaining] = remaining;

  if (questionId === undefined) {
    return { questionId: null, queue };
  }

  return {
    questionId,
    queue: {
      ...queue,
      remaining: nextRemaining,
      lastQuestionId: questionId,
      cycle: queue.cycle + (startsNewCycle ? 1 : 0),
    },
  };
}
