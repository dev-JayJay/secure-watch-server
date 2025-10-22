import { Router } from 'express';
import { AuthController } from '../controllers/auth.controllers.js';
const router = Router();
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/forgotten-password', AuthController.forgotPassword);
export default router;
