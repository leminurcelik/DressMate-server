const express = require('express');
const multer = require('multer');
const { addClothingImage }= require('../controllers/image.js');

const { verify } = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');

const router = express.Router();

/* // Set up multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
}); */
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
    /* const { filename, path, originalname } = req.file;
    try {
        console.log('req.userId:', req.userId);  
        const result = await addClothingImage(req.userId, filename, path, originalname);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message});
    } */
});

module.exports = router;