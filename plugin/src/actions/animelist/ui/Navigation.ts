import { GridHelper } from "@fcannizzaro/stream-deck-grid";
import { Filters } from "../manager";
import { cycle } from "@fcannizzaro/stream-deck-cycle";
import { uniq } from "ramda";
import { mal } from "@/api/mal";

export const Navigation = (
  grid: GridHelper,
  filters: Filters,
  overlay: boolean,
  updateGrid: () => void
) => {
  // available status
  const states = uniq(mal.userList.map((it) => it.status));

  // update filter
  const dir = overlay ? "off" : "on";
  const idx = grid.size.columns * (grid.size.rows - 1) + 1;
  grid.lock.clear();

  grid.update(idx, {
    type: "navigation",
    image: `./imgs/canvas/${dir}/${filters.status}.png`,
    locked: true,
    title: "",
    onPress: () => {
      const next = cycle(filters.status, states);
      filters.status = next;
      grid.pagination.reset(false);
      updateGrid();
    },
  });

  if (grid.pagination.required) {
    grid.update("bottom-right", {
      type: "navigation",
      image: `./imgs/canvas/${dir}/next.png`,
      locked: true,
      title: "",
      onPress: () => grid.pagination.next(),
    });
  }

  // always show the previous/close button
  grid.update("bottom-left", {
    type: "navigation",
    image: `./imgs/canvas/${dir}/prev.png`,
    locked: true,
    title: "",
    onPress: () => {
      if (grid.pagination.current < 1) {
        grid.destroy();
      } else {
        grid.pagination.previous();
      }
    },
  });
};
