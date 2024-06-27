import { Job, Worker } from "bullmq";

import sampleJob from "../jobs/sample.job";
import logger from '../config/logger.config';
import redisConnection from "../config/redis.config";

export default function SampleWorker(queueName: string) {
    new Worker(
        queueName,
        async (job: Job) => {
            if (job.name == 'SampleJob') {
                logger.info('job kicking in ', job);
                const sampleJobInstance = new sampleJob(job.data);
                sampleJobInstance.handle(job);
                return true;
            }
        },
        {
            connection: redisConnection
        }
    );
}