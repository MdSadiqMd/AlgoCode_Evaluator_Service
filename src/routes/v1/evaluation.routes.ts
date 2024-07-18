import express from 'express';

import { addEvaluation } from '../../controllers/evaluation.controller';
import { validateAddEvaluationDto } from '../../validators/zod.validator';
import { AddEvaluationZodSchema } from '../../dtos/addEvaluation.dto';

const evaluationRouter = express.Router();
evaluationRouter.post(
    '/',
    validateAddEvaluationDto(AddEvaluationZodSchema),
    addEvaluation
);

export default evaluationRouter;