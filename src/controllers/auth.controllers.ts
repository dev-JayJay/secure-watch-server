import bcrypt from 'bcryptjs';
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../models/user.model.js"
import { loginSchema, createUserSchema, forgotPasswordSchema } from "../schema/auth.schema.js";
import { generateToken } from '../utils/jwt.js';


const userModel = new UserModel();

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const parseResult = loginSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid input',
                    status: 'error',
                    data: null
                })
            }

            const { email, password } = parseResult.data;
            const user = await userModel.getUserByEmail(email);
            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: 'Invalid email or password',
                    status: 'error',
                    data: null
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user?.password || '');
            if (!isPasswordValid) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: 'Invalid email or password',
                    status: 'error',
                    data: null
                });
            }

            const token = generateToken({ id: user.id!, email: user.email, role: user.role || 'user' });

            return res.status(StatusCodes.OK).json({
                message: 'Login successful',
                status: 'success',
                data: {
                    token,
                    id: user.id,
                    fullName: user.fullname,
                    email: user.email,
                    role: user.role,
                }
            });
        } catch (error) {
            console.error("this is the server error: ", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                status: 'error',
                data: null
            });
        }
    }

    static async register(req: Request, res: Response) {
        try {
            const parseResult = createUserSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'All fields are required and must be valid',
                    status: 'error',
                    data: null
                });
            }

            const { fullName, email, password } = parseResult.data;
            const existingUser = await userModel.getUserByEmail(email);
            if (existingUser) {
                return res.status(StatusCodes.CONFLICT).json({
                    message: 'Email already in use',
                    status: 'error',
                    data: null
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await userModel.createUser({ fullname: fullName, email, password: hashedPassword });
            return res.status(StatusCodes.CREATED).json({
                message: 'User created successfully',
                status: 'success',
                data: {
                    id: newUser.id,
                    fullName: newUser.fullname,
                    email: newUser.email,
                    role: newUser.role,
                    created_at: newUser.created_at,
                    updated_at: newUser.updated_at,
                }
            });

        } catch (error: unknown) {
            console.log("this is the server error: ", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                status: 'error',
                data: null
            });
        }
    }


    static async forgotPassword(req: Request, res: Response) {
        try {

            const parseResult = forgotPasswordSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid input',
                    status: 'error',
                    data: null
                });
            }

            const { email } = parseResult.data;
            const user = await userModel.getUserByEmail(email);
            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: 'User not found',
                    status: 'error',
                    data: null
                });
            }
            return res.status(StatusCodes.OK).json({
                message: 'Password reset link sent to email (not really, this is a mock)',
                status: 'success',
                data: null
            });

        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                status: 'error',
                data: null
            });
        }
    }
}
