import Rating from '../models/Rating.js';
import Store from '../models/Store.js';
import User from '../models/User.js';

export const createRating = async (req, res) => {
  try {
    const { rating, storeId } = req.body;
    const userId = req.user.id; // Assuming user ID is available from verifyToken middleware

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const existingRating = await Rating.findOne({ where: { userId, storeId } });
    if (existingRating) {
      return res.status(409).json({ message: 'You have already rated this store' });
    }

    const newRating = await Rating.create({ rating, userId, storeId });
    res.status(201).json({ message: 'Rating created successfully', rating: newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating rating', error: error.message });
  }
};

export const getRatingsByStoreId = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const ratings = await Rating.findAll({
      where: { storeId },
      include: [{
        model: User,
        attributes: ['name', 'email'],
      }],
    });

    res.status(200).json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching ratings', error: error.message });
  }
};

export const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the token

    const ratings = await Rating.findAll({
      where: { userId },
      include: [{
        model: Store,
        attributes: ['id', 'name', 'address'],
      }],
    });

    res.status(200).json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user ratings', error: error.message });
  }
};

export const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const existingRating = await Rating.findOne({ where: { id, userId } });
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found or you do not have permission to update this rating' });
    }

    existingRating.rating = rating || existingRating.rating;
    await existingRating.save();

    res.status(200).json({ message: 'Rating updated successfully', rating: existingRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating rating', error: error.message });
  }
};

export const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingRating = await Rating.findOne({ where: { id, userId } });
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found or you do not have permission to delete this rating' });
    }

    await existingRating.destroy();
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting rating', error: error.message });
  }
};

export const getTotalRatings = async (req, res) => {
  try {
    const totalRatings = await Rating.count();
    res.status(200).json({ totalRatings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching total ratings', error: error.message });
  }
}