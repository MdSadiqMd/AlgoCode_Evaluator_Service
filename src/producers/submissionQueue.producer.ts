import logger from '../config/logger.config';
import submissionQueue from '../queues/submission.queue';

export default async function (payload: Record<string, unknown>) {
    await submissionQueue.add('SubmissionJob', payload);
    logger.info(`Successfully added a new job in Submission Queue: Payload: ${JSON.stringify(payload)}`);
}