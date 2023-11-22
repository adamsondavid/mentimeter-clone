import { initClient, tsRestFetchApi } from "@ts-rest/core";
import { contract } from "../../common/contract";
import { useClientId } from "./client-id";

const server = initClient(contract, {
  baseUrl: "",
  baseHeaders: { "x-client-id": "" },
  throwOnUnknownStatus: true,
  jsonQuery: true,
  api(args) {
    args.headers["x-client-id"] = useClientId().value;
    return tsRestFetchApi(args);
  },
});
export const useServer = () => server;
