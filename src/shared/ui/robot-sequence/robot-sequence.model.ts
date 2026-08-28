export type RobotSequenceVariant = "idle" | "jump" | "squat";

export interface RobotSequenceDefinition {
  readonly frameDurationMs: number;
  readonly frames: readonly string[];
}

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}assets/robot/${path}`;

const neutralFrame = assetUrl("squat/frame-00000.png");
const jumpFrames = Array.from({ length: 8 }, (_, index) =>
  assetUrl(`jump/frame-${(index + 1).toString().padStart(2, "0")}.png`),
);
const squatFrames = [
  ...Array.from({ length: 49 }, (_, index) =>
    assetUrl(`squat/frame-${index.toString().padStart(5, "0")}.png`),
  ),
  assetUrl("squat/smile.png"),
];

export const robotSequences = {
  idle: { frameDurationMs: 0, frames: [neutralFrame] },
  jump: { frameDurationMs: 120, frames: jumpFrames },
  squat: { frameDurationMs: 60, frames: squatFrames },
} as const satisfies Record<RobotSequenceVariant, RobotSequenceDefinition>;

export function getRobotSequence(variant: RobotSequenceVariant) {
  return robotSequences[variant];
}
