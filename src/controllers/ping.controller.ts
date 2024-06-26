import { Request, Response } from "express";

export const pingCheckController = (_: Request, res: Response) => {
    return res.status(200).json({
        message: "Pong check controller"
    });
};