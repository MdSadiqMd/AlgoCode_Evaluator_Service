import { Job } from "bullmq";

import { IJob } from "../types";
import logger from "../config/logger.config";

class sampleJob implements IJob {
    name: string;
    payload?: Record<string, unknown> | undefined;
    constructor(payload: Record<string, unknown>) {
        this.name = this.constructor.name;
        this.payload = payload;
    }

    handle = () => {
        logger.info('Job Handler');
    };

    failed = (job?: Job) => {
        logger.info('Job Failed');
        if (job) {
            logger.info(job.id);
        }
    };
}

export default sampleJob;