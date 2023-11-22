import { initContract } from "@ts-rest/core";
import Ably from "ably";
import { z } from "zod";

const answer = z.object({
  id: z.string().uuid(),
  answer: z.string().uuid(),
});
export type Answer = z.infer<typeof answer>;

const question = z.object({
  id: z.string().uuid(),
  question: z.string(),
  answers: z.array(answer),
});
export type Question = z.infer<typeof question>;

const vote = z.object({
  id: z.string().uuid(),
  answerId: z.string().uuid(),
});
export type Vote = z.infer<typeof vote>;

const c = initContract();
export const contract = c.router({
  getAblyTokenRequest: {
    method: "GET",
    path: "/api/ably-token-request",
    responses: { 200: c.type<Ably.Types.TokenRequest>() },
  },
  vote: {
    method: "POST",
    path: "/api/vote",
    body: vote,
    responses: { 200: vote },
  },
});
