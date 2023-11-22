import { useStorage } from "@vueuse/core";
import { v4 as uuid } from "uuid";
import { Ref } from "vue";

const clientId: Ref<string> = useStorage("client-id", uuid());
export const useClientId = () => clientId;
