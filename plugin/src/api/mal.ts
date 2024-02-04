import {
  MyAnimeList,
  MyAnimeListTokens,
  generateCodeVerifier,
} from "../../../../../../arctic";

import $ from "@elgato/streamdeck";
import { GlobalSettings } from "@/settings";
import {
  Anime,
  AnimeList,
  AnimeListSchema,
  AnimeSchema,
  UserSchema,
} from "./schemas";

const timers: Record<string, NodeJS.Timeout | undefined> = {
  score: undefined,
  episodes: undefined,
};

export const debounce = (key: string, fn: () => void) => {
  clearTimeout(timers[key]);
  timers[key] = setTimeout(fn, 1000);
};

const client = new MyAnimeList(process.env.MYANIMELIST_CLIENT_ID!, {
  redirectURI: "streamdeck://plugins/message/com.myanimelist.deck/callback",
});

const state = "stream-deck-authentication-state";
let codeVerifier: string;

class Mal {
  private credentials?: MyAnimeListTokens;
  public userList: AnimeList = [];
  public indexList: Map<string, Anime> = new Map();

  async init() {
    const settings = await $.settings.getGlobalSettings<GlobalSettings>();
    this.credentials = settings.credentials;
    this.animelist();
  }

  async authorize() {
    return new Promise<void>(async (resolve) => {
      // generate the authorization URL
      codeVerifier = generateCodeVerifier();
      const url = await client.createAuthorizationURL(state, codeVerifier);

      // wait for the credentials code
      $.system.onDidReceiveDeepLink(async ({ url }) => {
        if (url.path === "/callback") {
          const code = url.queryParameters.get("code")!;
          const credentials = await client.validateAuthorizationCode(
            code,
            codeVerifier
          );
          this.credentials = credentials;
          $.settings.setGlobalSettings({ credentials });
          resolve();
        }
      });
      // Open the URL in the default browser
      $.system.openUrl(url.toString());
    });
  }

  private async api(
    path: string,
    options?: {
      method?: "GET" | "POST" | "PUT";
      body?: Record<string, string | undefined | number>;
      params?: Record<string, string>;
    }
  ) {
    if (!this.credentials) {
      await this.authorize();
    }
    const query = new URLSearchParams(options?.params ?? []);
    const body = new URLSearchParams();

    if (options?.body) {
      for (const [key, value] of Object.entries(options.body)) {
        if (value !== undefined) {
          body.append(key, String(value));
        }
      }
    }

    const res = await fetch(`https://api.myanimelist.net/v2/${path}?${query}`, {
      method: options?.method,
      headers: {
        Authorization: `Bearer ${this.credentials!.accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      ...(options?.body && { body }),
    });
    return res.json();
  }

  async profile() {
    return UserSchema.parse(await this.api("users/@me"));
  }

  async loadAnime(id: string) {
    const anime = this.indexList.get(id)!;
    if (!anime.loaded) {
      const details = AnimeSchema.parse(
        await this.api(`anime/${id}`, {
          params: {
            fields: "num_episodes",
          },
        })
      );
      Object.assign(anime, details);
    }
  }

  async animelist() {
    const list = AnimeListSchema.parse(
      await this.api("users/@me/animelist", {
        params: {
          limit: "1000",
          fields: "list_status",
        },
      })
    );
    this.userList = list.data;
    this.indexList = new Map(list.data.map((it) => [it.id, it]));
  }

  anime(id?: string) {
    return this.indexList.get(id!)!;
  }

  async sync(id: string, type: string) {
    debounce(type, () => {
      const anime = this.indexList.get(id)!;
      return this.api(`anime/${id}/my_list_status`, {
        method: "PUT",
        body: {
          status: anime.status,
          score: anime.score,
          num_watched_episodes: anime.current,
        },
      });
    });
  }
}

export const mal = new Mal();
