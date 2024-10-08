import { Job } from "bullmq";

import { IJob, SubmissionPayload } from "../types";
import logger from "../config/logger.config";
import createExecutor from "../utils/ExecutorFactory.utils";
import evaluationQueueProducer from "../producers/evaluationQueue.producer";

class SubmissionJob implements IJob {
    name: string;
    payload?: Record<string, SubmissionPayload>;

    constructor(payload: Record<string, SubmissionPayload>) {
        this.name = this.constructor.name;
        this.payload = payload;
    }

    handle = async (job?: Job) => {
        logger.info(`Job Handler Initialized - Payload: ${JSON.stringify(this.payload)}`);
        if (job && this.payload) {
            logger.info(`Job Handling - payload: ${JSON.stringify(this.payload)}`);
            const key = Object.keys(this.payload)[0];
            console.log("key" + key);
            console.log(' payload' + JSON.stringify(this.payload));
            const language = this.payload[key].language;
            const code = this.payload[key].code;
            const inputTestCase = [this.payload[key].inputCase];
            const outputTestCase = [this.payload[key].outputCase];
            const strategy = createExecutor(language);
            if (strategy !== null) {
                const response = await strategy.execute(code, inputTestCase, outputTestCase);
                await evaluationQueueProducer({
                    response,
                    userId: this.payload[key].userId,
                    submissionId: this.payload[key].submissionId
                });
                if (response.status === 'SUCCESS') {
                    logger.info(`code executed Succesfully - ${JSON.stringify(response)}`);
                } else {
                    logger.error(`Error in Executing Code - ${JSON.stringify(response)}`);
                }
            }
        }
    };

    failed = (job?: Job) => {
        logger.error(`Job Handler Failed`);
        if (job) {
            logger.error(`Job Failed - ID: ${job.id}`);
        }
    };
}

export default SubmissionJob;