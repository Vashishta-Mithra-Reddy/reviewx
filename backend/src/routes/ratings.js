import express from 'express';
import { createRating, getRatingsByStoreId, updateRating, deleteRating, getTotalRatings, getUserRatings } from '../controllers/ratingController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createRating);
router.get('/total', verifyToken, getTotalRatings);
router.get('/user', verifyToken, getUserRatings);
router.get('/:storeId', verifyToken, getRatingsByStoreId);
router.put('/:id', verifyToken, updateRating);
router.delete('/:id', verifyToken, deleteRating);

export default router;