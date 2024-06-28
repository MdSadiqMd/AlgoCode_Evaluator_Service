import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { CreateSubmissionDto } from "../dtos/createSubmission.dto";

export function addSubmission(req: Request, res: Response) {
    const submissionDto = req.body as CreateSubmissionDto;
    if (submissionDto) {
        return res.status(StatusCodes.CREATED).json({
            success: true,
            error: {},
            message: 'Succesfully collected the submission',
            data: submissionDto
        });
    }
    return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {},
        message: 'Submission had not collected',
        data: {}
    });
}