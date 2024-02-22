const express = require('express');

const {locationInfo, getTemperature, getNextFiveDates}= require('../controllers/weather.js');

const router = express.Router();

router.get('/weatherInfo',  async (req, res) => {
    const {location,date, time} =req.query;
    try {
        const result = await getTemperature(location, date,time);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message});
    }
});



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

router.get('/next5Days', async (req, res) => {
    try {
        const result = await getNextFiveDates();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal error" });
    }
});

module.exports = router;