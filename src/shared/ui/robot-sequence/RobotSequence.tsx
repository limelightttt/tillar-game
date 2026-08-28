import { type CSSProperties, useEffect, useState } from "react";

import { getRobotSequence, type RobotSequenceVariant } from "./robot-sequence.model";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

import "./robot-sequence.css";

type AccessibleRobotSequenceProps =
  | { alt: string; decorative?: false }
  | { alt?: never; decorative: true };

export type RobotSequenceProps = AccessibleRobotSequenceProps & {
  className?: string;
  loop?: boolean;
  onComplete?: () => void;
  style?: CSSProperties;
  variant: RobotSequenceVariant;
};

export function RobotSequence({
  alt,
  className,
  decorative = false,
  loop = false,
  onComplete,
  style,
  variant,
}: RobotSequenceProps) {
  const sequence = getRobotSequence(variant);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);

    if (prefersReducedMotion || sequence.frames.length <= 1) {
      return undefined;
    }

    let currentFrame = 0;
    const timer = window.setInterval(() => {
      const nextFrame = currentFrame + 1;

      if (nextFrame >= sequence.frames.length) {
        if (loop) {
          currentFrame = 0;
          setFrameIndex(0);
          return;
        }

        window.clearInterval(timer);
        onComplete?.();
        return;
      }

      currentFrame = nextFrame;
      setFrameIndex(nextFrame);
    }, sequence.frameDurationMs);

    return () => window.clearInterval(timer);
  }, [loop, onComplete, prefersReducedMotion, sequence]);

  const visibleFrame = prefersReducedMotion
    ? sequence.frames.at(-1)
    : sequence.frames[frameIndex];

  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : alt}
      className={className ? `robot-sequence ${className}` : "robot-sequence"}
      data-robot-variant={variant}
      role={decorative ? undefined : "img"}
      style={style}
    >
      <img
        alt=""
        aria-hidden="true"
        className="robot-sequence__frame"
        decoding="async"
        draggable={false}
        src={visibleFrame}
      />
    </span>
  );
}
