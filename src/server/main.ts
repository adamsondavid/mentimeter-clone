import express from "express";
import { createExpressEndpoints } from "@ts-rest/express";
import { contract } from "../common/contract";
import { router } from "./router";

export const app = express()
  .use(express.urlencoded({ extended: false }))
  .use(express.json());
createExpressEndpoints(contract, router, app, { responseValidation: true, jsonQuery: true });
