import { Job, Worker } from "bullmq";

import sampleJob from "../jobs/sample.job";
import logger from '../config/logger.config';
import redisConnection from "../config/redis.config";

export default function SampleWorker(queueName: string) {
    new Worker(
        queueName,
        async (job: Job) => {
            logger.info(`Processing job: ${job.name} - ID: ${job.id} - Data: ${JSON.stringify(job.data)}`);
            if (job.name === 'SampleJob') {
                const sampleJobInstance = new sampleJob(job.data);
                await sampleJobInstance.handle(job);
                return true;
            }
        },
        {
            connection: redisConnection
        }
    );
}
