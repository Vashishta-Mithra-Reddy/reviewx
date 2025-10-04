import Store from '../models/Store.js';
import User from '../models/User.js';
import Rating from '../models/Rating.js';
import { Op } from 'sequelize';

export const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    
    if (!owner_id) {
      return res.status(400).json({ message: 'Owner ID is required' });
    }
    
    // Check if owner exists and is a store_owner
    const owner = await User.findOne({ 
      where: { 
        id: owner_id,
        role: 'store_owner'
      } 
    });
    
    if (!owner) {
      return res.status(404).json({ message: 'Valid store owner not found' });
    }
    
    const store = await Store.create({ name, email, address, owner_id });
    res.status(201).json({ message: 'Store created successfully', store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating store', error: error.message });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const { name, address, sortBy, sortOrder } = req.query;
    let whereClause = {};
    let orderClause = [];

    if (name) {
      whereClause.name = { [Op.iLike]: `%${name}%` };
    }
    if (address) {
      whereClause.address = { [Op.iLike]: `%${address}%` };
    }

    if (sortBy && sortOrder) {
      orderClause.push([sortBy, sortOrder.toUpperCase()]);
    }

    const stores = await Store.findAll({
      where: whereClause,
      order: orderClause,
      include: [
        {
          model: Rating,
          attributes: ['rating'],
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        }
      ],
    });

    const storesWithRatings = stores.map(store => {
      const totalRating = store.Ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = store.Ratings.length > 0 ? (totalRating / store.Ratings.length).toFixed(1) : null;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: averageRating,
        owner: store.owner ? {
          id: store.owner.id,
          name: store.owner.name,
          email: store.owner.email
        } : null
      };
    });

    res.status(200).json(storesWithRatings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching stores', error: error.message });
  }
};

// Add a new endpoint to get store by owner ID
export const getStoreByOwnerId = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const store = await Store.findOne({
      where: { owner_id: userId },
      include: [{
        model: Rating,
        attributes: ['id', 'rating', 'userId'],
        include: [{
          model: User,
          attributes: ['name', 'email'],
        }],
      }],
    });
    
    if (!store) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const totalRating = store.Ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = store.Ratings.length > 0 ? (totalRating / store.Ratings.length).toFixed(1) : null;

    res.status(200).json({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating: averageRating,
      ratings: store.Ratings.map(rating => ({
        id: rating.id,
        rating: rating.rating,
        userId: rating.userId,
        userName: rating.User ? rating.User.name : null,
        userEmail: rating.User ? rating.User.email : null,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching store', error: error.message });
  }
};

export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id, {
      include: [{
        model: Rating,
        attributes: ['rating', 'userId'],
        include: [{
          model: User,
          attributes: ['name', 'email'],
        }],
      }],
    });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const totalRating = store.Ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = store.Ratings.length > 0 ? (totalRating / store.Ratings.length).toFixed(1) : null;

    res.status(200).json({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating: averageRating,
      ratings: store.Ratings.map(rating => ({
        rating: rating.rating,
        userId: rating.userId,
        userName: rating.User ? rating.User.name : null,
        userEmail: rating.User ? rating.User.email : null,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching store', error: error.message });
  }
};

export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address } = req.body;
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    store.name = name || store.name;
    store.email = email || store.email;
    store.address = address || store.address;

    await store.save();
    res.status(200).json({ message: 'Store updated successfully', store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating store', error: error.message });
  }
};

export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    await store.destroy();
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting store', error: error.message });
  }
};