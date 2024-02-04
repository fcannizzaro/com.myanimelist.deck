import $ from "@elgato/streamdeck";

import { mal } from "@/api/mal";
import { AnimeList } from "@/actions/animelist/animelist";
import { Tile } from "@/actions/animelist/tile";

// Register the increment action.
$.actions.registerAction(new Tile());
$.actions.registerAction(new AnimeList());

// Finally, connect to the Stream Deck.
$.connect().then(() => {
  mal.init();
});

process.on("uncaughtException", (err) => {
  console.error(err);
});
