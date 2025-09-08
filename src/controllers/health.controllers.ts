import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const healthCheck = (req: Request, res: Response) => {
    res.json({
        message: '🧙‍♂️ The API lives! Magic is stable and spells are compiling.',
        StatusCodes: StatusCodes.OK,
        status: 'success',
        data: null
    });
}