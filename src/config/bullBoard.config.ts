import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from "@bull-board/express";

import sampleQueue from "../queues/sample.queue";
import submissionQueue from "../queues/submission.queue";
import evaluationQueue from '../queues/evaluation.queue';
import serverConfig from "./server.config";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath(serverConfig.BULLBOARDPATH);

createBullBoard({
    queues: [new BullMQAdapter(sampleQueue), new BullMQAdapter(submissionQueue), new BullMQAdapter(evaluationQueue)],
    serverAdapter: serverAdapter,
});

export default serverAdapter;