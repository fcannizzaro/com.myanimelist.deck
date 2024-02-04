import $, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { setupProfileGrid } from "@fcannizzaro/stream-deck-grid";
import { onPickerActivate } from "./manager";

export type AnimeListSettings = {
  showTitle?: boolean;
};

@action({ UUID: "com.myanimelist.deck.animelist" })
export class AnimeList extends SingletonAction<AnimeListSettings> {
  async onKeyDown(e: KeyDownEvent<AnimeListSettings>) {
    const device = $.devices.getDeviceById(e.deviceId)!;
    const size = device.size;
    if (!size) {
      return;
    }

    const grid = setupProfileGrid({
      streamDeck: $,
      profile: "MyAnimeList",
      device: e.deviceId,
      size,
    });

    onPickerActivate(grid, device.id, e.payload.settings, e.action);
  }
}
