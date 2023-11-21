import express from "express";
import { createExpressEndpoints } from "@ts-rest/express";
import { contract } from "../common/contract";
import { z } from "zod";
import Ably from "ably/callbacks";
import { initRouter } from "./router";

const env = z
  .object({
    ABLY_API_KEY: z.string(),
  })
  .parse(process.env);

const ably = new Ably.Rest.Promise(env.ABLY_API_KEY);
const router = initRouter(ably);

export const app = express()
  .use(express.urlencoded({ extended: false }))
  .use(express.json());
createExpressEndpoints(contract, router, app, { responseValidation: true, jsonQuery: true });
