import Router from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;