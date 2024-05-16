const express = require('express');
const { generateOutfit, saveOutfitStatus, saveOutfit, getSavedOutfits } = require('../controllers/outfit.js');
const verifyToken = require('../middleware/auth.js');

const router = express.Router();

router.get('/generateOutfit',verifyToken, async (req, res) => {
    try {
        const result = await generateOutfit(req.userId,req.query);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal error" });
    }
});

router.put('/saveOutfitStatus',verifyToken, async (req, res) => {
    try {
        const { id } = req.query;
        console.log('id:', id);
        const result = await saveOutfitStatus(req.userId,id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal error" });
    }
});

router.post('/saveOutfit',verifyToken, async (req, res) => {
    try {
        const result = await saveOutfit(req.userId,req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/getSavedOutfits',verifyToken, async (req, res) => {
    try {
        console.log('getSavedOutfits in routes');
        const result = await getSavedOutfits(req.userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal error" });
    }
});

module.exports = router;