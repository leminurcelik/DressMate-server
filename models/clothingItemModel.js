const clothingItemOptions = require('../config/clothingItemOptions.js');
const mongoose = require("mongoose");
const clothingItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // The user that owns the clothing item
        required: true,
        ref: 'User', // The model to use
    },
    name: {
        type: String,
        required: true,
    },
    style: {
        type: String,
        required: true,
        enum: clothingItemOptions.styleOptions,
    },
    color: {
        type: String,
        required: true,
        enum: clothingItemOptions.colorOptions,
    },
    wearableWeather: {
        type: String,
        required: true,
        enum: clothingItemOptions.wearableWeatherOptions,
    },
    category: { // top, bottom, shoes, one-piece, accessory, outerwear
        type: String,
        required: true,
        enum: clothingItemOptions.categoryOptions,
    },
    subcategory: { // t-shirt, blouse, dress, skirt, pants, shorts, jeans, sneakers, sandals, boots, hat, scarf, jacket, coat, etc.
        type: String,
        required: true,
        enum: clothingItemOptions.subcategoryOptions,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    isClean: {
        type: Boolean,
        required: true,
        default: true,
    },
    isFavorite: {
        type: Boolean,
        required: true,
        default: false,
    },
    details: { //optional???
        type: Object,
        required: false,    
    },
});

const ClothingItem = mongoose.model("ClothingItem", clothingItemSchema);

module.exports = ClothingItem;