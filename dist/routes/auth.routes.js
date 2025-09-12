import { Router } from 'express';
import { AuthController } from '../controllers/auth.controllers.js';
const { login: Login, register: Register, forgotPassword: ForgottenPassword } = AuthController;
const router = Router();
router.get('/login', Login);
router.get('/register', Register);
router.get('/forgotten-password', ForgottenPassword);
export default router;
