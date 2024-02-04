import { splitEvery } from "ramda";

const ellipse = (text: string, length: number) =>
  text.length > length ? text.slice(0, length - 3) + ".." : text;

export const splitTitle = (value?: string | null, max: number = 30) => {
  if (!value) {
    return undefined;
  }
  const [first, ...words] = value.split(" ").flatMap((it) => splitEvery(9, it));
  let out = "";
  let previous = first;
  words.forEach((word) => {
    if (out.length > max) {
      return;
    }
    if (previous.length + word.length < 8) {
      previous += ` ${word}`;
    } else {
      out += `${previous}\n`;
      previous = word;
    }
  });
  out += previous;
  return ellipse(out, max);
};
