import express from 'express';

import { addSubmission } from '../../controllers/submission.controller';

const submissionRouter = express.Router();
submissionRouter.post('/', addSubmission);

export default submissionRouter;