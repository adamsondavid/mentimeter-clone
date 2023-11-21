import { initServer } from "@ts-rest/express";
import { contract } from "../common/contract";
import Ably from "ably/callbacks";

export function initRouter(ably: Ably.Types.RestPromise) {
  return initServer().router(contract, {
    async getAblyTokenRequest() {
      const token = await ably.auth.createTokenRequest({ capability: { "*": ["subscribe"] } });
      return { status: 200, body: token };
    },
    async sendMessage({ body }) {
      await ably.channels.get("chat").publish("chat-message", body.message);
      return { status: 200, body };
    },
  });
}
