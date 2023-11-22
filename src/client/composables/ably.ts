import Ably from "ably";
import { useServer } from "./server";
import { PresentationId } from "../../common/contract";

export const useAbly = (presentationId: PresentationId) => {
  return new Ably.Realtime.Promise({
    async authCallback(_, callback) {
      try {
        const response = await useServer().getEventsTokenByPresentationCode({ params: { presentationId } });
        if (response.status === 200) callback(null, response.body);
      } catch (e: any) {
        callback(e, null);
      }
    },
  });
};
