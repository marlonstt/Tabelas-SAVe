import { Router } from 'express';
import { login, register, changePassword, getUsers, deleteUser, updateUser } from '../controllers/authController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', authMiddleware, adminMiddleware, register);
router.post('/change-password', authMiddleware, changePassword);
router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.put('/users/:id', authMiddleware, adminMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
