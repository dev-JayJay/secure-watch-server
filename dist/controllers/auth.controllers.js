import { response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../models/user.model.js";
import { loginSchema, createUserSchema, forgotPasswordSchema } from "../schema/auth.schema.js";
const userModel = new UserModel();
export class AuthController {
    static async login(req, res) {
        try {
            const parseResult = loginSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid input',
                    status: 'error',
                    data: null
                });
            }
            const { email, password } = parseResult.data;
            const user = await userModel.getUserByEmail(email);
            if (!user || user.password !== password) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: 'Invalid email or password',
                    status: 'error',
                    data: null
                });
            }
            return res.status(StatusCodes.OK).json({
                message: 'Login successful',
                status: 'success',
                data: {
                    id: user.id,
                    fullName: user.fullname,
                    email: user.email,
                    role: user.role,
                }
            });
        }
        catch (error) {
        }
    }
    static async register(req, res) {
        try {
            const parseResult = createUserSchema.safeParse(req.body);
            if (!parseResult.success) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid input',
                    status: 'error',
                    data: null
                });
            }
            const { fullName, email, password } = parseResult.data;
            const existingUser = await userModel.getUserByEmail(email);
            if (existingUser) {
                response.status(StatusCodes.CONFLICT).json({
                    message: 'Email already in use',
                    status: 'error',
                    data: null
                });
            }
            const newUser = await userModel.createUser({ fullname: fullName, email, password });
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
        }
        catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                status: 'error',
                data: null
            });
        }
    }
    static async forgotPassword(req, res) {
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
        }
        catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error',
                status: 'error',
                data: null
            });
        }
    }
}
