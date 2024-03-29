import { mal } from "@/api/mal";
import { Cell, GridHelper } from "@fcannizzaro/stream-deck-grid";
import { Cover } from "../util/Cover";
import { neighbourhood } from "../util/neighbourhood";
import { EpisodesButtons } from "./EpisodeButtons";
import { StatusButton } from "./StatusButton";
import { ScoreButton } from "./ScoreButton";

export const renderAnime = async (
  grid: GridHelper,
  btn: Cell,
  popup: Set<number>,
  beforePopup: () => void | Promise<void>,
  reset: () => void
) => {
  const [pos, flip] = neighbourhood(btn.idx!, grid.size, popup);
  const anime = mal.anime(btn.id);

  const reload = () => {
    renderAnime(grid, btn, popup, beforePopup, reset);
  };

  const refresh = () => {
    const separator = anime.current > 999 ? " /\n" : " / ";
    const title = [anime.current, anime.total ?? "?"].join(separator);
    const idx = grid.buttons.findIndex((it) => it.type === "episodes");
    return grid.update(idx, { title });
  };

  const buttons = [
    StatusButton({ anime, grid, reload }),
    ScoreButton({ anime, grid }),
    ...EpisodesButtons({ anime, grid, reload, refresh }),
  ];

  // insert cover/title button
  buttons.splice(pos, 0, {
    title: "",
    image: () => Cover(anime.main_picture!, false),
    onPress: reset,
  });

  // run beforePopup hook
  await beforePopup();

  // flip buttons if the button is in the last row
  if (flip) {
    const reversed = [...buttons.slice(3), ...buttons.slice(0, 3)];
    buttons.length = 0;
    buttons.push(...reversed);
  }

  // update popup buttons
  await Promise.all(
    Array.from(popup).map((it, i) => {
      grid.update(it, buttons[i]);
    })
  );

  // load anime details if not present
  mal.loadAnime(anime.id).then(() => refresh());
};
