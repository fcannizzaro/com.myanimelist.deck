import { mal } from "@/api/mal";
import { Anime } from "@/api/schemas";
import { Popup } from "@/util/images";
import { Cell, GridHelper } from "@fcannizzaro/stream-deck-grid";

interface EpisodesButtonsProps {
  anime: Anime;
  grid: GridHelper;
  reload: () => void;
  refresh: () => void;
}

export const EpisodesButtons = ({
  anime,
  reload,
  refresh,
}: EpisodesButtonsProps): Cell[] => {
  const onChange = (add: 1 | -1) => {
    const current = anime.current + add;
    anime.current = anime.total ? Math.min(current, anime.total) : current;
    if (anime.total && current >= anime.total) {
      anime.status = "completed";
      reload();
    } else {
      refresh();
    }

    mal.sync(anime.id, "episodes");
  };

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
