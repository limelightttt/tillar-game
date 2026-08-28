import { afterEach, describe, expect, it, vi } from "vitest";

import { decodeRobotFrames } from "./robot-frame-loader";
import { type RobotFrame } from "./robot-sequence.model";

const frame: RobotFrame = {
  height: 20,
  src: "/frame.png",
  width: 10,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("decodeRobotFrames", () => {
  it("waits for decode and decodes a duplicate URL only once", async () => {
    let finishDecode: (() => void) | undefined;
    let decodeCalls = 0;
    const decodeGate = new Promise<void>((resolve) => {
      finishDecode = resolve;
    });

    class FakeImage {
      complete = true;
      decoding = "auto";
      naturalHeight: number;
      naturalWidth: number;
      src = "";

      constructor(width: number, height: number) {
        this.naturalHeight = height;
        this.naturalWidth = width;
      }

      decode() {
        decodeCalls += 1;
        return decodeGate;
      }
    }

    vi.stubGlobal("Image", FakeImage);

    let settled = false;
    const decodedFrames = decodeRobotFrames([frame, frame], false).then((result) => {
      settled = true;
      return result;
    });

    await Promise.resolve();
    expect(decodeCalls).toBe(1);
    expect(settled).toBe(false);

    finishDecode?.();
    const result = await decodedFrames;
    expect(result).toHaveLength(1);
    expect(result.has(frame.src)).toBe(true);
  });

  it("rejects decoded pixels that disagree with frame metadata", async () => {
    class WrongSizeImage {
      complete = true;
      decoding = "auto";
      naturalHeight = 1;
      naturalWidth = 1;
      src = "";

      decode() {
        return Promise.resolve();
      }
    }

    vi.stubGlobal("Image", WrongSizeImage);

    await expect(decodeRobotFrames([frame], false)).rejects.toThrow(
      "Robot frame metadata does not match /frame.png",
    );
  });

  it("shares an in-flight decode between mounted consumers", async () => {
    let decodeCalls = 0;

    class CachedImage {
      complete = true;
      decoding = "auto";
      naturalHeight: number;
      naturalWidth: number;
      src = "";

      constructor(width: number, height: number) {
        this.naturalHeight = height;
        this.naturalWidth = width;
      }

      decode() {
        decodeCalls += 1;
        return Promise.resolve();
      }
    }

    vi.stubGlobal("Image", CachedImage);
    const cachedFrame = { ...frame, src: "/cached-frame.png" };

    await Promise.all([
      decodeRobotFrames([cachedFrame], true),
      decodeRobotFrames([cachedFrame], true),
    ]);
    expect(decodeCalls).toBe(1);
  });
});
