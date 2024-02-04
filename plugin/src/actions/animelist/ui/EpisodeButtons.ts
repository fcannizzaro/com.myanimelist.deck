import { mal } from "@/api/mal";
import { Anime } from "@/api/schemas";
import { Popup } from "@/util/images";
import { Cell, GridHelper } from "@fcannizzaro/stream-deck-grid";

interface EpisodesButtonsProps {
  anime: Anime;
  grid: GridHelper;
  reload: () => void;
}

export const EpisodesButtons = ({
  anime,
  grid,
  reload,
}: EpisodesButtonsProps): Cell[] => {
  const refresh = () => {
    const separator = anime.current > 999 ? " /\n" : " / ";
    const title = [anime.current, anime.total ?? "?"].join(separator);
    const idx = grid.buttons.findIndex((it) => it.type === "episodes");
    return grid.update(idx, { title });
  };

  const onChange = (add: 1 | -1) => {
    const current = anime.current + add;
    anime.current = current;
    if (anime.total) {
      anime.status = current > anime.total ? "completed" : anime.status;
      reload();
    }
    refresh();
    mal.sync(anime.id, "episodes");
  };

  // load anime details if not present
  mal.loadAnime(anime.id).then(refresh);

  return [
    {
      title: "",
      image: Popup.minus,
      onPress: () => onChange(-1),
    },
    {
      title: `${anime.current}`,
      image: Popup.current,
      type: "episodes",
    },
    {
      title: "",
      image: Popup.plus,
      onPress: () => onChange(1),
    },
  ];
};
