import { createApp, inject, InjectionKey } from "vue";
import Ably from "ably";
import { server } from "./server";

const ABLY: InjectionKey<Ably.Types.RealtimePromise> = Symbol();
const ably = new Ably.Realtime.Promise({
  async authCallback(_, callback) {
    try {
      const response = await server.getAblyTokenRequest();
      if (response.status === 200) callback(null, response.body);
      else callback("failed to get ably token request: " + response.status, null);
    } catch (e: any) {
      callback(e, null);
    }
  },
});

export function initAbly() {
  return {
    install(app: ReturnType<typeof createApp>) {
      app.provide(ABLY, ably);
    },
  };
}

export function useAbly() {
  return inject(ABLY)!;
}
