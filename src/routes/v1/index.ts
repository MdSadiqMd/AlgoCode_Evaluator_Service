import express from "express";

import { pingCheck } from "../../controllers/ping.controller";

const v1Router = express.Router();
v1Router.get('/ping', pingCheck);

export default v1Router;