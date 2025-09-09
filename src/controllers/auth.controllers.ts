import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const Register = (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'All fields are required',
                status: 'error',
                data: null
            });
        }
    } catch (error) {
        res.json({
            message: 'this is the register route',
            StatusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
            status: 'success',
            data: null
        });
    } finally {

    }

}

export const Login = (req: Request, res: Response) => {
    res.json({
        message: 'this is the register route',
        StatusCodes: StatusCodes.OK,
        status: 'success',
        data: null
    });
}

export const ForgottenPassword = (req: Request, res: Response) => {
    res.json({
        message: 'this is the forgotten password route',
        StatusCodes: StatusCodes.OK,
        status: 'success',
        data: null
    });
}