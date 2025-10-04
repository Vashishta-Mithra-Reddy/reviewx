import express from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, getStoreOwners, updateMyPassword } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();


router.put('/me/password', verifyToken, updateMyPassword);
router.post('/', verifyToken, checkRole(['admin']), createUser);
router.get('/', verifyToken, checkRole(['admin']), getAllUsers);
router.get('/store-owners', verifyToken, checkRole(['admin']), getStoreOwners);
router.get('/:id', verifyToken, checkRole(['admin']), getUserById);
router.put('/:id', verifyToken, checkRole(['admin']), updateUser);
router.delete('/:id', verifyToken, checkRole(['admin']), deleteUser);

export default router;