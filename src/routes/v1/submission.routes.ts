import express from 'express';

import { addSubmission } from '../../controllers/submission.controller';
import { validateCreateSubmissionDto } from '../../validators/zod.validator';
import { createSubmissionZodSchema } from '../../dtos/createSubmission.dto';

const submissionRouter = express.Router();
submissionRouter.post(
    '/',
    validateCreateSubmissionDto(createSubmissionZodSchema),
    addSubmission
);

export default submissionRouter;