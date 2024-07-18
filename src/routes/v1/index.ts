import express from "express";

import { pingCheckController } from "../../controllers/ping.controller";
import submissionRouter from "./submission.routes";
import evaluationRouter from "./evaluation.routes";

const v1Router = express.Router();
v1Router.use('/submissions', submissionRouter);
v1Router.use('/evaluations', evaluationRouter);
v1Router.get('/ping', pingCheckController);

export default v1Router;