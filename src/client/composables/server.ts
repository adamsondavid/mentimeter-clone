import { createApp, inject, InjectionKey } from "vue";
import { initClient } from "@ts-rest/core";
import { contract } from "../../common/contract";

const SERVER: InjectionKey<typeof server> = Symbol();
export const server = initClient(contract, {
  baseUrl: "",
  baseHeaders: {},
  throwOnUnknownStatus: true,
  jsonQuery: true,
});

export function initServer() {
  return {
    install(app: ReturnType<typeof createApp>) {
      app.provide(SERVER, server);
    },
  };
}

export function useServer() {
  return inject(SERVER)!;
}
