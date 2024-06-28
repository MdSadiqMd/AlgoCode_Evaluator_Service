import bodyParser from "body-parser";
import express, { Express } from "express";

import serverConfig from "./config/server.config";
import apiRouter from "./routes";
/* import sampleQueueProducer from "./producers/sampleQueue.producer"; */
import SampleWorker from "./workers/sample.worker";
import serverAdapter from "./config/bullBoard.config";
import logger from "./config/logger.config";
import runPython from "./containers/runPython.container";

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use('/api', apiRouter);
app.use(serverConfig.BULLBOARDPATH, serverAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
    logger.info(`Server started at ${JSON.stringify(serverConfig.PORT)}`);

    SampleWorker('SampleQueue');
    const code = `print("Hello World")`;
    runPython(code);
    /* sampleQueueProducer('SampleJob', {
        name: 'Sadiq',
        company: 'UHI',
        location: 'Remote'
    }, 2);
    sampleQueueProducer('SampleJob', {
        name: 'Sadiq1',
        company: 'UHI',
        location: 'Remote'
    }, 1);  */
});
