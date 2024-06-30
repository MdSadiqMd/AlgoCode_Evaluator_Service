import { Job, Worker } from "bullmq";

import SubmissionJob from "../jobs/submission.job";
import logger from '../config/logger.config';
import redisConnection from "../config/redis.config";

function SubmissionWorker(queueName: string) {
    new Worker(
        queueName,
        async (job: Job) => {
            logger.info(`Processing job: ${job.name} - ID: ${job.id} - Data: ${JSON.stringify(job.data)}`);
            if (job.name === 'SubmissionJob') {
                const submissionJobInstance = new SubmissionJob(job.data);
                await submissionJobInstance.handle(job);
                return true;
            }
        },
        {
            connection: redisConnection
        }
    );
}

export default SubmissionWorker;