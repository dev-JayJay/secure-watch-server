import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const Register = (req: Request, res: Response) => {
    res.json({
        message: 'this is the register route',
        StatusCodes: StatusCodes.OK,
        status: 'success',
        data: null
    }); 
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