import { Router } from 'express';
import { Login, Register, ForgottenPassword } from '../controllers/auth.controllers.js';

const router = Router();

router.get('/login', Login);
router.get('/register', Register);
router.get('/forgotten-password', ForgottenPassword);

export default router;
