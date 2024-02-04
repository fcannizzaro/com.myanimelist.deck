import { cache } from "@/util/cache";
import { createCanvas, createImage } from "@/util/canvas";
import { shadow } from "@/util/images";
import { downloadAsArrayBuffer } from "@fcannizzaro/stream-deck-image";

export const Cover = (url: string, overlay?: boolean) => {
  const cacheKey = [url, overlay];

  // Check if the image is already cached
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  return new Promise<string>(async (resolve) => {
    // Generate the image
    const source = await downloadAsArrayBuffer(url);
    if (!source) return "";
    const canvas = await createCanvas(144);
    const ctx = canvas.getContext("2d");
    const image = await createImage(source);

    if (image) {
      const size = image.width();
      const y = (image.height() - size) / 2;
      ctx.drawImage(image, 0, y, size, size, 0, 0, 144, 144);
    }

    const shadowImage = await createImage(shadow);
    ctx.drawImage(shadowImage, 0, 0, 144, 144);

    if (overlay) {
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 144, 144);
    }

    // Cache the image
    const data = canvas.toDataURL();
    cache.set(cacheKey, data);
    resolve(data);
  });
};
