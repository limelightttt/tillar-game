import { type RobotFrame } from "./robot-sequence.model";

const decodedFrameCache = new Map<string, WeakRef<HTMLImageElement>>();
const pendingFrameCache = new Map<string, Promise<HTMLImageElement>>();

export function getUniqueRobotFrames(frames: readonly RobotFrame[]) {
  const seenSources = new Set<string>();

  return frames.filter(({ src }) => {
    if (seenSources.has(src)) {
      return false;
    }

    seenSources.add(src);
    return true;
  });
}

function createDecodedFrame(frame: RobotFrame) {
  const image = new Image(frame.width, frame.height);
  image.decoding = "async";
  image.src = frame.src;

  return image.decode().then(() => {
    if (
      !image.complete ||
      image.naturalWidth !== frame.width ||
      image.naturalHeight !== frame.height
    ) {
      throw new Error(`Robot frame metadata does not match ${frame.src}`);
    }

    return image;
  });
}

function getDecodedFrame(frame: RobotFrame, cache: boolean) {
  if (!cache) {
    return createDecodedFrame(frame);
  }

  const cachedFrame = decodedFrameCache.get(frame.src)?.deref();
  if (cachedFrame) {
    return Promise.resolve(cachedFrame);
  }

  const pendingFrame = pendingFrameCache.get(frame.src);
  if (pendingFrame) {
    return pendingFrame;
  }

  const decodedFrame = createDecodedFrame(frame);
  pendingFrameCache.set(frame.src, decodedFrame);
  void decodedFrame.then(
    (image) => {
      if (pendingFrameCache.get(frame.src) === decodedFrame) {
        pendingFrameCache.delete(frame.src);
        decodedFrameCache.set(frame.src, new WeakRef(image));
      }
    },
    () => {
      if (pendingFrameCache.get(frame.src) === decodedFrame) {
        pendingFrameCache.delete(frame.src);
      }
    },
  );

  return decodedFrame;
}

export async function decodeRobotFrames(frames: readonly RobotFrame[], cache: boolean) {
  const uniqueFrames = getUniqueRobotFrames(frames);
  const decodedFrames = await Promise.all(
    uniqueFrames.map(async (frame) => [frame.src, await getDecodedFrame(frame, cache)] as const),
  );

  return new Map(decodedFrames);
}
