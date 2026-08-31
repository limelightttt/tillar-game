import { describe, expect, it } from "vitest";

import { getUniqueRobotFrames } from "./robot-frame-loader";
import {
  getRobotFramePlacement,
  getRobotSequence,
  getRobotTimelinePosition,
  robotSequences,
} from "./robot-sequence.model";

describe("robotSequences", () => {
  it("preserves the complete 70-frame encourage timeline with only 50 unique URLs", () => {
    const frames = robotSequences.encourage.frames;

    expect(frames).toHaveLength(70);
    expect(frames[49]?.src).toBe(frames[0]?.src);
    expect(frames[50]?.src).toBe(frames[0]?.src);
    expect(frames[51]?.src).toBe(robotSequences.encourage.reducedMotionFrame.src);
    expect(frames[52]?.src).toBe(frames[51]?.src);
    expect(frames[53]?.src).toBe(frames[51]?.src);
    expect(getUniqueRobotFrames(frames)).toHaveLength(50);
  });

  it("keeps legacy asset names as semantic aliases", () => {
    expect(getRobotSequence("jump")).toBe(getRobotSequence("celebrate"));
    expect(getRobotSequence("squat")).toBe(getRobotSequence("encourage"));
  });

  it("uses deliberate, readable action durations", () => {
    expect(robotSequences.celebrate.frameDurationMs).toBe(120);
    expect(robotSequences.celebrate.durationMs).toBe(960);
    expect(robotSequences.encourage.frameDurationMs).toBe(50);
    expect(robotSequences.encourage.durationMs).toBe(3_500);
    expect(robotSequences.idle.durationMs).toBe(0);
  });

  it("completes a one-shot exactly after its full timeline", () => {
    const sequence = robotSequences.celebrate;

    expect(getRobotTimelinePosition(sequence, 0, false)).toEqual({
      completed: false,
      frameIndex: 0,
    });
    expect(getRobotTimelinePosition(sequence, sequence.durationMs - 1, false)).toEqual({
      completed: false,
      frameIndex: 7,
    });
    expect(getRobotTimelinePosition(sequence, sequence.durationMs, false)).toEqual({
      completed: true,
      frameIndex: 7,
    });
  });

  it("wraps a loop without reporting completion", () => {
    const sequence = robotSequences.encourage;

    expect(getRobotTimelinePosition(sequence, sequence.durationMs, true)).toEqual({
      completed: false,
      frameIndex: 0,
    });
  });

  it("bottom-centers every celebrate crop at one pixel scale", () => {
    const { frameScale, frames, stage } = robotSequences.celebrate;

    expect(frames).toHaveLength(8);
    expect(stage).toEqual({ height: 512, width: 512 });
    expect(frameScale).toBe(512 / 823);

    for (const frame of frames) {
      const placement = getRobotFramePlacement(stage, frame, frameScale);
      expect(placement.x + placement.width / 2).toBe(stage.width / 2);
      expect(placement.y + placement.height).toBe(stage.height);
      expect(placement.width).toBe(frame.width * frameScale);
      expect(placement.height).toBe(frame.height * frameScale);
      expect(placement.width).toBeLessThanOrEqual(stage.width);
      expect(placement.height).toBeLessThanOrEqual(stage.height);
    }
  });

  it("uses one stable square presentation stage for every semantic variant", () => {
    expect(robotSequences.idle.stage).toEqual({ height: 512, width: 512 });
    expect(robotSequences.celebrate.stage).toEqual(robotSequences.idle.stage);
    expect(robotSequences.encourage.stage).toEqual(robotSequences.idle.stage);
  });
});
