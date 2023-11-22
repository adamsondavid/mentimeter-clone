import { initContract } from "@ts-rest/core";
import Ably from "ably";
import { z } from "zod";

const presentationId = z.string().length(8);
export type PresentationId = z.infer<typeof presentationId>;

const choice = z.object({
  id: z.string().uuid(),
  choice: z.string().uuid(),
});
export type Choice = z.infer<typeof choice>;

const question = z.object({
  id: z.string().uuid(),
  question: z.string(),
  choices: z.array(choice),
});
export type Question = z.infer<typeof question>;

const answer = z.object({
  id: z.string().uuid(),
  questionId: question.shape.id, // TODO: expose whole question, not only id
  choiceId: choice.shape.id, // TODO: expose whole choice, not only id
});
export type Answer = z.infer<typeof answer>;

const c = initContract();
export const contract = c.router(
  {
    getEventsTokenByPresentationCode: {
      method: "GET",
      path: "/presentations/:presentationId/events/token",
      pathParams: z.object({ presentationId }),
      responses: { 200: c.type<Ably.Types.TokenRequest>() },
    },
    putAnswer: {
      method: "PUT",
      path: "/presentations/:presentationId/questions/:questionId/answer",
      pathParams: z.object({ presentationId, questionId: question.shape.id }),
      body: z.object({ choiceId: choice.shape.id }),
      responses: { 200: answer },
    },
  },
  {
    pathPrefix: "/api",
    baseHeaders: z.object({
      "x-client-id": z.string().uuid(),
    }),
  },
);
