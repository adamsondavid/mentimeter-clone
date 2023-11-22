import { initServer } from "@ts-rest/express";
import { Answer, contract } from "../common/contract";
import Ably from "ably/callbacks";

export function initRouter(ably: Ably.Types.RestPromise) {
  return initServer().router(contract, {
    async getEventsTokenByPresentationCode({ headers, params }) {
      const token = await ably.auth.createTokenRequest({
        clientId: headers["x-client-id"],
        capability: { [params.presentationId]: ["presence", "subscribe"] },
      });
      return { status: 200, body: token };
    },
    async putAnswer({ headers, params, body }) {
      const answer: Answer = { id: headers["x-client-id"], questionId: params.questionId, choiceId: body.choiceId };
      await ably.channels.get(params.presentationId).publish("answer", answer);
      return { status: 200, body: answer };
    },
  });
}
