import express from 'express';
import { createStore, getAllStores, getStoreById, updateStore, deleteStore, getStoreByOwnerId } from '../controllers/storeController.js';
import { verifyToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/', verifyToken, checkRole(['admin']), createStore);
router.get('/', verifyToken, getAllStores);
router.get('/owner', verifyToken, checkRole(['store_owner']), getStoreByOwnerId);
router.get('/:id', verifyToken, getStoreById);
router.put('/:id', verifyToken, checkRole(['admin']), updateStore);
router.delete('/:id', verifyToken, checkRole(['admin']), deleteStore);

export default router;