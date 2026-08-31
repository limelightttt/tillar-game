export type RobotSequenceIntent = "celebrate" | "encourage" | "idle";
export type RobotSequenceLegacyVariant = "jump" | "squat";
export type RobotSequenceVariant = RobotSequenceIntent | RobotSequenceLegacyVariant;

export interface RobotFrame {
  readonly height: number;
  readonly src: string;
  readonly width: number;
}

export interface RobotStage {
  readonly height: number;
  readonly width: number;
}

export interface RobotSequenceDefinition {
  readonly durationMs: number;
  readonly frameDurationMs: number;
  readonly frameScale: number;
  readonly frames: readonly RobotFrame[];
  readonly intent: RobotSequenceIntent;
  readonly posterFrame: RobotFrame;
  readonly reducedMotionFrame: RobotFrame;
  readonly stage: RobotStage;
}

export interface RobotTimelinePosition {
  readonly completed: boolean;
  readonly frameIndex: number;
}

export interface RobotFramePlacement {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

const ENCOURAGE_FRAME_DURATION_MS = 50;
const CELEBRATE_FRAME_DURATION_MS = 120;
const ROBOT_STAGE_SIZE = 512;

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}assets/robot/${path}`;

const neutralFrame: RobotFrame = {
  height: 512,
  src: assetUrl("squat/frame-00000.png"),
  width: 512,
};

const smileFrame: RobotFrame = {
  height: 512,
  src: assetUrl("squat/smile.png"),
  width: 512,
};

const encourageActionFrames = Array.from({ length: 49 }, (_, frameIndex): RobotFrame => {
  const frameNumber = frameIndex.toString().padStart(5, "0");

  return {
    height: 512,
    src: assetUrl(`squat/frame-${frameNumber}.png`),
    width: 512,
  };
});

// The supplied sequence has 70 authored timeline slots. Slots 49-50 and 54-69
// duplicate the neutral PNG; slots 51-53 duplicate the smile PNG. Keeping the
// slots preserves every authored hold while avoiding duplicate network assets.
const encourageTimeline = [
  ...encourageActionFrames,
  neutralFrame,
  neutralFrame,
  smileFrame,
  smileFrame,
  smileFrame,
  ...Array.from({ length: 16 }, () => neutralFrame),
] as const;

const celebrateDimensions = [
  [402, 751],
  [399, 739],
  [606, 696],
  [444, 701],
  [420, 810],
  [405, 823],
  [421, 739],
  [390, 774],
] as const;

const celebrateFrames = celebrateDimensions.map(([width, height], frameIndex): RobotFrame => ({
  height,
  src: assetUrl(`jump/frame-${(frameIndex + 1).toString().padStart(2, "0")}.png`),
  width,
}));

const idleSequence: RobotSequenceDefinition = {
  durationMs: 0,
  frameDurationMs: 0,
  frameScale: 1,
  frames: [neutralFrame],
  intent: "idle",
  posterFrame: neutralFrame,
  reducedMotionFrame: neutralFrame,
  stage: { height: 512, width: 512 },
};

const celebrateSequence: RobotSequenceDefinition = {
  durationMs: celebrateFrames.length * CELEBRATE_FRAME_DURATION_MS,
  frameDurationMs: CELEBRATE_FRAME_DURATION_MS,
  // The source crops are taller than the other supplied sequences. A single
  // scale fits every jump frame into the same square presentation stage.
  frameScale: ROBOT_STAGE_SIZE / Math.max(...celebrateFrames.map(({ height }) => height)),
  frames: celebrateFrames,
  intent: "celebrate",
  posterFrame: celebrateFrames[0] ?? neutralFrame,
  reducedMotionFrame: celebrateFrames.at(-1) ?? neutralFrame,
  stage: { height: ROBOT_STAGE_SIZE, width: ROBOT_STAGE_SIZE },
};

const encourageSequence: RobotSequenceDefinition = {
  durationMs: encourageTimeline.length * ENCOURAGE_FRAME_DURATION_MS,
  frameDurationMs: ENCOURAGE_FRAME_DURATION_MS,
  frameScale: 1,
  frames: encourageTimeline,
  intent: "encourage",
  posterFrame: neutralFrame,
  reducedMotionFrame: smileFrame,
  stage: { height: 512, width: 512 },
};

export const robotSequences = {
  celebrate: celebrateSequence,
  encourage: encourageSequence,
  idle: idleSequence,
  // Asset-oriented names remain supported for existing callers.
  jump: celebrateSequence,
  squat: encourageSequence,
} as const satisfies Record<RobotSequenceVariant, RobotSequenceDefinition>;

export function getRobotSequence(variant: RobotSequenceVariant) {
  return robotSequences[variant];
}

export function getRobotTimelinePosition(
  sequence: RobotSequenceDefinition,
  elapsedMs: number,
  loop: boolean,
): RobotTimelinePosition {
  if (sequence.frames.length <= 1 || sequence.frameDurationMs <= 0) {
    return { completed: false, frameIndex: 0 };
  }

  const elapsed = Math.max(0, elapsedMs);
  const timelineFrame = Math.floor(elapsed / sequence.frameDurationMs);

  if (loop) {
    return { completed: false, frameIndex: timelineFrame % sequence.frames.length };
  }

  if (timelineFrame >= sequence.frames.length) {
    return { completed: true, frameIndex: sequence.frames.length - 1 };
  }

  return { completed: false, frameIndex: timelineFrame };
}

export function getRobotFramePlacement(
  stage: RobotStage,
  frame: RobotFrame,
  frameScale = 1,
): RobotFramePlacement {
  const width = frame.width * frameScale;
  const height = frame.height * frameScale;

  return {
    height,
    width,
    x: (stage.width - width) / 2,
    y: stage.height - height,
  };
}
