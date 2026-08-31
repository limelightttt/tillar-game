import { prepareRobotFrames } from "./robot-frame-loader";
import { robotSequences } from "./robot-sequence.model";

let actionPreparation: Promise<void> | undefined;

export function preloadRobotActions() {
  actionPreparation ??= Promise.allSettled([
    prepareRobotFrames(robotSequences.celebrate.frames),
    prepareRobotFrames(robotSequences.encourage.frames),
  ]).then(() => undefined);

  return actionPreparation;
}
