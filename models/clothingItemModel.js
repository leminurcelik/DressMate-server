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
    subcategory: { 
        type: String,
        required: true,
        enum: function() {
            switch(this.category) {
                case 'Top':
                    return clothingItemOptions.subCategoriesofTop;
                case 'Bottom':
                    return clothingItemOptions.subCategoriesofBottom;
                case 'Shoes':
                    return clothingItemOptions.subCategoriesofShoes;
                case 'One-piece':
                    return clothingItemOptions.subCategoriesofOnePiece;
                case 'Outerwear':
                    return clothingItemOptions.subCategoriesofOuterwear;
                default:
                    return [];
            }
        }
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