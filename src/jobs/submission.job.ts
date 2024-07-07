import { Job } from "bullmq";

import { IJob, SubmissionPayload } from "../types";
import logger from "../config/logger.config";

class SubmissionJob implements IJob {
    name: string;
    payload?: Record<string, SubmissionPayload>;

    constructor(payload: Record<string, SubmissionPayload>) {
        this.name = this.constructor.name;
        this.payload = payload;
    }

    handle = (job?: Job) => {
        logger.info(`Job Handler Initialized - Payload: ${JSON.stringify(this.payload)}`);
        // Update it 
        if (job) {
            logger.info(`Job Handling - payload: ${JSON.stringify(this.payload)}`);
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