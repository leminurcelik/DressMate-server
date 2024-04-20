const express = require('express');

const {addClothingItem, updateClothingItem, getItemsByCategory, getItemsBySubcategory, getItemsById, getAllClothingItems, favoriteStatus, laundryStatus, deleteClothingItem, addClothingItems, getItemsInFavorites, getItemsInLaundryBasket}= require('../controllers/clothingItem.js');
const {User} = require("../models/userModel.js");

const { verify } = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');
const clothingItemOptions = require('../config/clothingItemOptions.js');

const router = express.Router();

router.post('/addClothingItem',verifyToken, async (req, res) => {
    console.log('req.body:', req.body);
    try {
        console.log('req.userId:', req.userId);  
        const result = await addClothingItem(req.userId, req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message});
    }
});


router.post('/addClothingItems',verifyToken, async (req, res) => {
    console.log('req.body:', req.body);
    try {
        console.log('req.userId:', req.userId);  
        const result = await addClothingItems(req.userId, req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message});
    }
});

router.put('/updateClothingItem',verifyToken, async (req, res) => {
    const { itemId } = req.query;
    console.log('req.body:', req.body);
    try {
        console.log('req.userId:', req.userId);  
        const result = await updateClothingItem(req.userId, itemId, req.body);
        res.status(200).json({ message: 'Clothing item updated successfully', data: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: error.message});
    }
});

router.delete('/deleteClothingItem',verifyToken, async (req, res) => {
    const { itemId } = req.query;

    try {
        console.log('req.userId:', req.userId);  
        const result = await deleteClothingItem(req.userId, itemId);
        res.status(200).json({ message: 'Clothing item deleted successfully', data: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: error.message});
    }
});

router.put('/favoriteStatus',verifyToken, async (req, res) => {
    const { itemId } = req.query;
    try {
        console.log('req.userId:', req.userId);  
        const result = await favoriteStatus(req.userId, itemId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(403).send({ message: error.message});
    }
});

router.put('/laundryStatus',verifyToken, async (req, res) => {
    const { itemId } = req.query;
    try {
        console.log('req.userId:', req.userId);  
        const result = await laundryStatus(req.userId, itemId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(403).send({ message: error.message});
    }
});

router.get('/getItemsByCategory',verifyToken, async (req, res) => {
    const { category, page, limit } = req.query;
    try {
        const result = await getItemsByCategory(category, req.userId, page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal error" });
    }
});

router.get('/getAllItems',verifyToken, async (req, res) => {
    const { page, limit } = req.query;
    try {
        const result = await getAllClothingItems(req.userId, page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal error" });
    }
});

router.get('/getItemsBySubcategory',verifyToken, async (req, res) => {
    const { subcategory, page, limit } = req.query;
    try {
        const result = await getItemsBySubcategory(subcategory, req.userId, page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal error" });
    }
});

//is userId needed?
router.get('/getItemById',verifyToken, async (req, res) => {
    const { itemId } = req.query;
    try {
        const result = await getItemsById(itemId, req.userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal error" });
    }
});

router.get('/getOptions', async (req, res) => {
    try {
        res.json(clothingItemOptions);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message});
    }
});

router.get('/getItemsInFavorites',verifyToken, async (req, res) => {
    const { page, limit } = req.query;
    try {
        const result = await getItemsInFavorites(req.userId, page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal error" });
    }
});

router.get('/getItemsInLaundryBasket',verifyToken, async (req, res) => {
    const { page, limit } = req.query;
    try {
        const result = await getItemsInLaundryBasket(req.userId, page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal error" });
    }
});

module.exports = router;