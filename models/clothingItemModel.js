const clothingItemOptions = require('../config/clothingItemOptions.js');
const mongoose = require("mongoose");
const clothingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // The user that owns the clothing item
        required: true,
        ref: 'User', // The model to use
    },
    style: {
        type: String,
        required: true,
        enum: clothingItemOptions.styleOptions,
    },
    color: {
        type: [{
            type: String,
            enum: clothingItemOptions.colorOptions,
        }],
        required: true,
        validate: [arrayLimit, '{PATH} needs to have at least 1 color.']
    },
    pattern: {
        type: String,
        required: true,
        enum: clothingItemOptions.patternOptions,
    },
    wearableWeather: {
        type: [{
            type: String,
            enum: clothingItemOptions.wearableWeatherOptions,
        }],
        required: true,
        validate: [arrayLimit, '{PATH} needs to have at least 1 weather condition.']
    },
    category: { // top, bottom, shoes, one-piece, accessory, outerwear
        type: String,
        required: true,
        enum: clothingItemOptions.categoryOptions,
    },
    subcategory: { 
        type: String,
        required: true,
        validate: {
            validator: function() {
                switch(this.category) {
                    case 'Top':
                        return clothingItemOptions.subCategoriesofTop.includes(this.subcategory);
                    case 'Bottom':
                        return clothingItemOptions.subCategoriesofBottom.includes(this.subcategory);
                    case 'Shoes':
                        return clothingItemOptions.subCategoriesofShoes.includes(this.subcategory);
                    case 'One-piece':
                        return clothingItemOptions.subCategoriesofOnePiece.includes(this.subcategory);
                    case 'Outerwear':
                        return clothingItemOptions.subCategoriesofOuterwear.includes(this.subcategory);
                    default:
                        return false;
                }
            },
            message: props => `${props.value} is not a valid subcategory for the selected category.`,
        },
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

function arrayLimit(val) {
    console.log(val,"arrayLimit");
    return val.length > 0;
  }

const ClothingItem = mongoose.model("ClothingItem", clothingItemSchema);

module.exports = ClothingItem;