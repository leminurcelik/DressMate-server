const express = require('express');
const multer = require('multer');

const { verify } = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { suggestClothingItemDetails, rgbToHsl, getColorBucket } = require('../controllers/image');

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



// Suggest clothing item details endpoint
router.get('/suggestClothingItemDetails', verifyToken, async (req, res) => {
    const { imageUrl } = req.query;
    const userId = req.userId;

    try {
        const objects = await suggestClothingItemDetails(userId, imageUrl);
        return res.status(200).json({ objects });
    } catch (error) {
        //console.error('Error suggesting clothing item details:', error.message);
        return res.status(500).json({ error: 'Failed to suggest clothing item details' });
    }
});

router.get('/getColorBucket', verifyToken, async (req, res) => {
    const { r, g, b } = req.query;
    const hsl = rgbToHsl(r, g, b);
    const bucket = getColorBucket(hsl);
    return res.status(200).json({ bucket });
}); 


module.exports = router;