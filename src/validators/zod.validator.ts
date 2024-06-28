import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { CreateSubmissionDto } from "../dtos/createSubmission.dto";
import logger from "../config/logger.config";

export const validateCreateSubmissionDto = (schema: ZodSchema<CreateSubmissionDto>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            ...req.body
        });
        next();
    } catch (error) {
        logger.error(`Error in validating Submission: ${error}`);
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            error: error,
            message: 'Something went Wrong in Validating submission',
            data: {}
        });
    }
};