const express = require('express');
const { generateOutfit } = require('../controllers/outfit.js');
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

module.exports = router;