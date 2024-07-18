import { Job } from "bullmq";

import { IJob, EvaluationPayload } from "../types";
import logger from "../config/logger.config";

class EvaluationJob implements IJob {
    name: string;
    payload?: Record<string, EvaluationPayload>;

    constructor(payload: Record<string, EvaluationPayload>) {
        this.name = this.constructor.name;
        this.payload = payload;
    }

    handle = async (job?: Job) => {
        logger.info(`Evaluation Handler Initialized - Payload: ${JSON.stringify(this.payload)}`);
        if (job && this.payload) {
            logger.info(`Job Handling - payload: ${JSON.stringify(this.payload)}`);
            const response = Object.keys(this.payload)[0];
            if (response) {
                logger.info(`Evaluation executed Successfully - ${JSON.stringify(response)}`);
            } else {
                logger.error(`Error in Pushing Evaluation - ${JSON.stringify(response)}`);
            }
        }
    };

    failed = (job?: Job) => {
        logger.error(`Evaluation Handler Failed`);
        if (job) {
            logger.error(`Evaluation Failed - ID: ${job.id}`);
        }
    };
}

export default EvaluationJob;