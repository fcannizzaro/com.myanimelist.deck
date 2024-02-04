import { z } from "zod";

export const UserSchema = z.object({
  location: z.string(),
  picture: z.string(),
  name: z.string(),
  joined_at: z.string(),
  id: z.number(),
});

export const ListStatusType = z.enum([
  "watching",
  "completed",
  "on_hold",
  "dropped",
  "plan_to_watch",
]);

export const AnimeListSchema = z.object({
  paging: z.object({
    next: z.string().optional(),
  }),
  data: z
    .object({
      list_status: z.object({
        status: ListStatusType,
        score: z.number(),
        num_episodes_watched: z.number(),
      }),
      node: z.object({
        id: z.number().transform((it) => it.toString()),
        title: z.string(),
        main_picture: z
          .object({
            medium: z.string().optional(),
          })
          .transform((data) => data.medium),
      }),
    })

    .transform((data) => {
      const listStatus = data.list_status;
      return {
        ...data.node,
        status: listStatus.status,
        score: listStatus.score,
        current: listStatus.num_episodes_watched,
        total: undefined,
        loaded: false,
      };
    })
    .array(),
});

export const AnimeSchema = z
  .object({
    num_episodes: z.number().optional(),
  })
  .transform((data) => {
    return {
      total: data.num_episodes,
      loaded: true,
    };
  });

export type AnimeList = z.infer<typeof AnimeListSchema>["data"];

export type Anime = z.infer<typeof AnimeListSchema>["data"][number];

export type AnimeStatus = z.infer<typeof ListStatusType>;
