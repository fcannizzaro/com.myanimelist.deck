import { mal } from "@/api/mal";
import { Anime } from "@/api/schemas";
import { Popup } from "@/util/images";
import { Cell, GridHelper } from "@fcannizzaro/stream-deck-grid";

interface ScoreButtonProps {
  anime: Anime;
  grid: GridHelper;
}

export const ScoreButton = ({ anime, grid }: ScoreButtonProps): Cell => {
  return {
    title: `${anime.score}`,
    image: Popup.score,
    onPress: (btn) => {
      anime.score = (anime.score + 1) % 11;
      grid.update(btn.idx!, { title: `${anime.score}` });
      mal.sync(anime.id, "score");
    },
  };
};
