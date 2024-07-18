import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { AddEvaluationDto } from "../dtos/addEvaluation.dto";

export function addEvaluation(req: Request, res: Response) {
    const evaluationDto = req.body as AddEvaluationDto;
    if (evaluationDto) {
        return res.status(StatusCodes.CREATED).json({
            success: true,
            error: {},
            message: 'Succesfully collected the evaluation',
            data: evaluationDto
        });
    }
    return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: {},
        message: 'Evaluation had not collected',
        data: {}
    });
}