import { initContract } from "@ts-rest/core";
import Ably from "ably";
import { z } from "zod";

const c = initContract();
export const contract = c.router({
  getAblyTokenRequest: {
    method: "GET",
    path: "/api/ably-token-request",
    responses: {
      200: c.type<Ably.Types.TokenRequest>(),
    },
  },
  sendMessage: {
    method: "POST",
    path: "/api/message",
    body: z.object({ message: z.string() }),
    responses: {
      200: z.object({ message: z.string() }),
    },
  },
});
