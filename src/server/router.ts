import { initServer } from "@ts-rest/express";
import { contract } from "../common/contract";
import Ably from "ably/callbacks";

export function initRouter(ably: Ably.Types.RestPromise) {
  return initServer().router(contract, {
    async getAblyTokenRequest() {
      const token = await ably.auth.createTokenRequest({ capability: { "*": ["subscribe"] } });
      return { status: 200, body: token };
    },
    async vote({ body }) {
      await ably.channels.get("main").publish("vote", body);
      return { status: 200, body };
    },
  });
}
