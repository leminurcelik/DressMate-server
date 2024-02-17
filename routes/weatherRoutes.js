const express = require('express');

const {weatherInfo, locationInfo }= require('../controllers/weather.js');

const router = express.Router();

router.post('/getLatLon');


router.get('/LocationInfo', async (req, res) => {
    const { location } = req.query;
    try {
        const result = await locationInfo(location);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal error" });
    }
});

module.exports = router;