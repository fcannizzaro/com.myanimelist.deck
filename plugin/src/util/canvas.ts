import { downloadAsArrayBuffer } from "@fcannizzaro/stream-deck-image";
import CanvasKitInit, {
  CanvasKit,
  EmulatedCanvas2DContext,
  Image,
} from "canvaskit-wasm/bin/canvaskit.js";

let canvas: CanvasKit | undefined;

const CanvasImages = new Map<string, Image>();

export const loadCanvasKit = async () => {
  if (!canvas) {
    canvas = await CanvasKitInit({
      locateFile: (file) => process.cwd() + "/" + file,
    });
  }
  return canvas;
};

export const createCanvas = async (size: number) => {
  const Canvas = await loadCanvasKit();
  return Canvas.MakeCanvas(size, size);
};

export const createImage = async (image: ArrayBuffer) => {
  const Canvas = await loadCanvasKit();
  return Canvas.MakeImageFromEncoded(image);
};

export const loadImage = async (key: string, image: ArrayBuffer) => {
  if (CanvasImages.has(key)) {
    return CanvasImages.get(key);
  }
  const img = await createImage(image);
  img && CanvasImages.set(key, img);
  return img;
};

export const loadImageFromUrl = async (url: string) => {
  const image = await downloadAsArrayBuffer(url);
  if (image) {
    return loadImage(url, image);
  }
};

export const grayscale = (ctx: EmulatedCanvas2DContext) => {
  const imageData = ctx.getImageData(0, 0, 144, 144);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  ctx.putImageData(imageData, 0, 0);
};
