import {
  readAsArrayBuffer,
  readAsBase64,
} from "@fcannizzaro/stream-deck-image";

const base = "./imgs/canvas/";

export const shadow = readAsArrayBuffer(`${base}/shadow.png`);

export const Loader = {
  off: readAsBase64(`${base}/off/loader.png`),
  on: readAsBase64(`${base}/on/loader.png`),
};

export const Popup = {
  plus: readAsBase64(`${base}/popup/plus.png`),
  minus: readAsBase64(`${base}/popup/minus.png`),
  current: readAsBase64(`${base}/popup/current.png`),
  score: readAsBase64(`${base}/popup/score.png`),
};
