import { Job, Worker } from "bullmq";

import EvaluationJob from "../jobs/evaluation.job";
import logger from '../config/logger.config';
import redisConnection from "../config/redis.config";

function EvaluationWorker(queueName: string) {
    new Worker(
        queueName,
        async (job: Job) => {
            logger.info(`Processing job: ${job.name} - ID: ${job.id} - Data: ${JSON.stringify(job.data)}`);
            if (job.name === 'EvaluationJob') {
                const evaluationJobInstance = new EvaluationJob(job.data);
                await evaluationJobInstance.handle(job);
                return true;
            }
        },
        {
            connection: redisConnection
        }
    );
}

export default EvaluationWorker;