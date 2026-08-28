import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";

import { decodeRobotFrames } from "./robot-frame-loader";
import {
  getRobotFramePlacement,
  getRobotSequence,
  getRobotTimelinePosition,
  type RobotFrame,
  type RobotSequenceVariant,
} from "./robot-sequence.model";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

import "./robot-sequence.css";

type AccessibleRobotSequenceProps =
  | {
      alt: string;
      decorative?: false;
    }
  | {
      alt?: never;
      decorative: true;
    };

export type RobotSequenceProps = AccessibleRobotSequenceProps & {
  className?: string;
  /** Plays continuously when true. Animated variants are one-shot by default. */
  loop?: boolean;
  /** Called once after the last timeline frame of a one-shot animation. */
  onComplete?: () => void;
  /** Reuses decoded frames on later mounts and replays while memory allows. */
  preload?: boolean;
  /** Change this value to replay the same mounted variant from its first frame. */
  replayKey?: number | string;
  style?: CSSProperties;
  /**
   * idle: calm screens; celebrate: success; encourage: mistakes or a loss.
   * jump and squat remain as backwards-compatible aliases.
   */
  variant: RobotSequenceVariant;
};

interface PreparedRobotRun {
  readonly cacheDecodedFrames: boolean;
  readonly decodedFrames: ReadonlyMap<string, HTMLImageElement>;
  readonly replayKey: number | string | undefined;
  readonly variant: RobotSequenceVariant;
}

function isSameRun(
  run: PreparedRobotRun | null,
  variant: RobotSequenceVariant,
  replayKey: number | string | undefined,
  cacheDecodedFrames: boolean,
) {
  return (
    run?.variant === variant &&
    Object.is(run.replayKey, replayKey) &&
    run.cacheDecodedFrames === cacheDecodedFrames
  );
}

function drawRobotFrame(
  canvas: HTMLCanvasElement,
  frame: RobotFrame,
  image: HTMLImageElement,
  stage: { height: number; width: number },
) {
  const context = canvas.getContext("2d");
  if (!context) {
    return false;
  }

  const placement = getRobotFramePlacement(stage, frame);
  context.clearRect(0, 0, stage.width, stage.height);
  context.drawImage(image, placement.x, placement.y, placement.width, placement.height);
  return true;
}

export function RobotSequence({
  alt,
  className,
  decorative = false,
  loop = false,
  onComplete,
  preload = true,
  replayKey,
  style,
  variant,
}: RobotSequenceProps) {
  const sequence = getRobotSequence(variant);
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopRef = useRef(loop);
  const onCompleteRef = useRef(onComplete);
  const [preparedRun, setPreparedRun] = useState<PreparedRobotRun | null>(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    if (prefersReducedMotion || sequence.frames.length <= 1) {
      return undefined;
    }

    let cancelled = false;
    let fallbackCompletionFrame = 0;

    const completeWithoutAnimation = () => {
      if (!cancelled && !loopRef.current) {
        fallbackCompletionFrame = window.requestAnimationFrame(() => onCompleteRef.current?.());
      }
    };

    void decodeRobotFrames(sequence.frames, preload)
      .then((decodedFrames) => {
        if (cancelled) {
          return;
        }

        const canvas = canvasRef.current;
        const firstFrame = sequence.frames[0];
        const firstImage = firstFrame ? decodedFrames.get(firstFrame.src) : undefined;

        if (!canvas || !firstFrame || !firstImage) {
          completeWithoutAnimation();
          return;
        }

        if (!drawRobotFrame(canvas, firstFrame, firstImage, sequence.stage)) {
          completeWithoutAnimation();
          return;
        }

        setPreparedRun((currentRun) =>
          isSameRun(currentRun, variant, replayKey, preload)
            ? currentRun
            : { cacheDecodedFrames: preload, decodedFrames, replayKey, variant },
        );
      })
      .catch(() => {
        // The poster remains visible if any frame cannot be decoded.
        completeWithoutAnimation();
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(fallbackCompletionFrame);
    };
  }, [prefersReducedMotion, preload, replayKey, sequence, variant]);

  const runIsPrepared =
    isSameRun(preparedRun, variant, replayKey, preload) && !prefersReducedMotion;

  useLayoutEffect(() => {
    if (!runIsPrepared || !preparedRun || sequence.frames.length <= 1) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const firstFrame = sequence.frames[0];
    const firstImage = firstFrame ? preparedRun.decodedFrames.get(firstFrame.src) : undefined;
    if (
      !firstFrame ||
      !firstImage ||
      !drawRobotFrame(canvas, firstFrame, firstImage, sequence.stage)
    ) {
      return undefined;
    }

    let animationFrame = 0;
    let currentFrameIndex = 0;
    let startedAt: number | undefined;

    const updateFrame = (timestamp: number) => {
      startedAt ??= timestamp;
      const position = getRobotTimelinePosition(sequence, timestamp - startedAt, loop);

      if (position.frameIndex !== currentFrameIndex) {
        const frame = sequence.frames[position.frameIndex];
        const image = frame ? preparedRun.decodedFrames.get(frame.src) : undefined;

        if (frame && image && drawRobotFrame(canvas, frame, image, sequence.stage)) {
          currentFrameIndex = position.frameIndex;
        }
      }

      if (position.completed) {
        onCompleteRef.current?.();
        return;
      }

      animationFrame = window.requestAnimationFrame(updateFrame);
    };

    animationFrame = window.requestAnimationFrame(updateFrame);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [loop, preparedRun, runIsPrepared, sequence]);

  useEffect(() => {
    if (!prefersReducedMotion || loop || sequence.frames.length <= 1) {
      return undefined;
    }

    const completionFrame = window.requestAnimationFrame(() => onCompleteRef.current?.());
    return () => window.cancelAnimationFrame(completionFrame);
  }, [loop, prefersReducedMotion, replayKey, sequence, variant]);

  const posterFrame = prefersReducedMotion ? sequence.reducedMotionFrame : sequence.posterFrame;
  const posterWidth = `${(posterFrame.width / sequence.stage.width) * 100}%`;
  const rootClassName = className ? `robot-sequence ${className}` : "robot-sequence";

  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : alt}
      className={rootClassName}
      data-robot-intent={sequence.intent}
      data-robot-renderer={runIsPrepared ? "canvas" : "poster"}
      data-robot-variant={variant}
      role={decorative ? undefined : "img"}
      style={{
        ...style,
        aspectRatio: `${sequence.stage.width} / ${sequence.stage.height}`,
      }}
    >
      <img
        alt=""
        aria-hidden="true"
        className="robot-sequence__poster"
        decoding="async"
        draggable={false}
        fetchPriority={sequence.intent === "idle" ? "auto" : "high"}
        height={posterFrame.height}
        loading={sequence.intent === "idle" ? "lazy" : "eager"}
        src={posterFrame.src}
        style={{ width: posterWidth }}
        width={posterFrame.width}
      />
      <canvas
        aria-hidden="true"
        className="robot-sequence__canvas"
        height={sequence.stage.height}
        ref={canvasRef}
        width={sequence.stage.width}
      />
    </span>
  );
}
