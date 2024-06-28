import { Job } from "bullmq";

import { IJob } from "../types";
import logger from "../config/logger.config";

class SampleJob implements IJob {
    name: string;
    payload?: Record<string, unknown>;

    constructor(payload: Record<string, unknown>) {
        this.name = this.constructor.name;
        this.payload = payload;
    }

    handle = (job?: Job) => {
        logger.info(`Job Handler Initialized - Payload: ${JSON.stringify(this.payload)}`);
        if (job) {
            logger.info(`Job Handling - Name: ${job.name} - ID: ${job.id} - Data: ${JSON.stringify(job.data)}`);
        }
    };

    failed = (job?: Job) => {
        logger.error(`Job Handler Failed`);
        if (job) {
            logger.error(`Job Failed - ID: ${job.id}`);
        }
    };
}

export default SampleJob;