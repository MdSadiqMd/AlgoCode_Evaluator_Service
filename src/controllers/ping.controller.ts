import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const pingCheckController = (_: Request, res: Response) => {
    return res.status(StatusCodes.OK).json({
        message: "Pong check controller"
    });
};