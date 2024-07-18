import logger from '../config/logger.config';
import evaluationQueue from '../queues/evaluation.queue';

export default async function (payload: Record<string, unknown>) {
    await evaluationQueue.add('EvaluationJob', payload);
    logger.info(`Successfully added a new job in Evaluation Queue: Payload: ${JSON.stringify(payload)}`);
}