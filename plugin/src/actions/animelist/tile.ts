import { action } from "@elgato/streamdeck";
import { GridAction } from "@fcannizzaro/stream-deck-grid";

/**
 * dynamic tile
 */
@action({ UUID: "com.myanimelist.deck.tile" })
export class Tile extends GridAction {}
