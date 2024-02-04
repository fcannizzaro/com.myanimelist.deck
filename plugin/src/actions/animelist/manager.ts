import { Action } from "@elgato/streamdeck";
import { Cell, GridHelper } from "@fcannizzaro/stream-deck-grid";
import { AnimeListSettings } from "./animelist";
import { AnimeStatus } from "@/api/schemas";
import { mal } from "@/api/mal";
import { Cover } from "./util/Cover";
import { splitTitle } from "@/util/titles";
import { renderAnime } from "./ui/Popup";
import { Loader } from "@/util/images";
import { Navigation } from "./ui/Navigation";

export interface Filters {
  status: AnimeStatus;
}

export const onPickerActivate = (
  grid: GridHelper,
  device: string,
  settings: AnimeListSettings,
  action: Action
) => {
  // init the grid
  grid.init();

  const filters: Filters = {
    status: "watching",
  };

  const popup = new Set<number>();
  const showTitle = settings.showTitle ?? true;

  const updateGrid = () => {
    const on = !popup.size;
    const items = mal.userList
      .filter((it) => it.status === filters.status)
      .map((it, i) => ({
        id: it.id,
        title: on && showTitle ? splitTitle(it.title) : "",
        image: () => Cover(it.main_picture!, popup.size > 0 && !popup.has(i)),
        onPress: undefined,
        loader: on ? Loader.on : Loader.off,
        type: "anime",
      }));
    const outside = new Array(
      Math.max(0, grid.available.length - items.length - 1)
    ).fill({
      onPress: () => {
        popup.clear();
        updateGrid();
      },
    });
    return grid.fill([...items, ...outside], {
      keepPage: true,
    });
  };

  // render navigation
  grid.onPreRender(() => {
    Navigation(grid, filters, popup.size > 0, updateGrid);
  });

  grid.on("press", (btn: Cell) => {
    if (btn.type === "anime") {
      renderAnime(grid, btn, popup, updateGrid, () => {
        popup.clear();
        updateGrid();
      });
    }
  });

  grid.on("ready", () => {
    updateGrid();
  });

  grid.open();
};
