import { mal } from "@/api/mal";
import { Anime } from "@/api/schemas";
import { Cell, GridHelper } from "@fcannizzaro/stream-deck-grid";

const SwapStatus = {
  watching: "completed",
  completed: "watching",
  plan_to_watch: "watching",
  on_hold: "watching",
  dropped: "dropped",
} as const;

interface StatusButtonProps {
  anime: Anime;
  grid: GridHelper;
  reload: () => void;
}

export const StatusButton = ({
  anime,
  grid,
  reload,
}: StatusButtonProps): Cell => {
  return {
    title: "",
    image: `./imgs/canvas/on/${anime.status}.png`,
    onPress: (btn) => {
      anime.status = SwapStatus[anime.status];
      if (
        anime.status === "completed" &&
        anime.total &&
        anime.current !== anime.total
      ) {
        anime.current = anime.total;
        reload();
      } else {
        grid.update(btn, {
          image: `./imgs/canvas/on/${anime.status}.png`,
        });
      }
      mal.sync(anime.id, "status");
    },
  };
};
