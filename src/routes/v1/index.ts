import express from "express";

import { pingCheckController } from "../../controllers/ping.controller";

const v1Router = express.Router();
v1Router.get('/ping', pingCheckController);

export default v1Router;