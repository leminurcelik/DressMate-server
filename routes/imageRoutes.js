const express = require('express');
const multer = require('multer');

const { verify } = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload endpoint
router.post('/upload', upload.single('image'),verifyToken, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
    }

    const formData = new FormData();
    formData.append('image', req.file.buffer.toString('base64')); // Convert buffer to base64 string

    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            headers: {
                'Content-Type': 'image/jpeg', // Set the correct content type
            },
        });
        
        return res.status(200).json({ imageUrl: response.data.data.url });
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ error: 'Failed to upload image' });
    }
});

module.exports = router;