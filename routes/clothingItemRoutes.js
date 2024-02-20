const express = require('express');

const {addClothingItem, getItemsByCategory, getItemsBySubcategory, getItemsById, getAllClothingItems}= require('../controllers/clothingItem.js');
const { verify } = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');

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

module.exports = router;