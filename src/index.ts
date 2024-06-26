import bodyParser from "body-parser";
import express, { Express } from "express";

import serverConfig from "./config/server.config";
import apiRouter from "./routes";

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use('/api', apiRouter);

app.listen(serverConfig.PORT, () => {
    console.log(`Server started at ${serverConfig.PORT}`);
});
