import { z } from "zod";

export const env = z
  .object({
    ABLY_API_KEY: z.string(),
  })
  .parse(process.env);
