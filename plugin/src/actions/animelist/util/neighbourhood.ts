import { Size } from "@fcannizzaro/stream-deck-grid";

export const neighbourhood = (idx: number, size: Size, popup: Set<number>) => {
  let center = idx % size.columns;
  let pos = 1;
  if (center < 1) {
    center = center + 1;
    pos = 0;
  }
  if (center >= size.columns - 1) {
    center = center - 1;
    pos = 2;
  }
  const row = Math.floor(idx / size.columns);
  const isLastLine = row >= size.rows - 1;
  const mul = isLastLine ? row - 1 : row;
  center += mul * size.columns;
  //  clear previous popup
  popup.clear();
  popup.add(center - 1);
  popup.add(center);
  popup.add(center + 1);
  popup.add(center - 1 + size.columns);
  popup.add(center + size.columns);
  popup.add(center + 1 + size.columns);
  return [pos, isLastLine] as const;
};
