/*Cothing Item Model:
    * Attributes:
    * itemId: Unique identifier for each clothing item.
    * itemName: Name or description of the clothing item.
    * itemType: Category or type of the clothing item (e.g., shirt, pants, shoes).
    * itemColor: options will be set
    * itemImage: Image or reference to an image of the clothing item. (Url)
    * isClean: Boolean indicating whether the item is clean or dirty.
    * isFavorite: Boolean indicating whether the item is favorite or not. */
const colorOptions = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Gray']; // Example color options
const styleOptions = ['Casual', 'Formal', 'Sportswear', 'Evening']; // Example style options
const categoryOptions = ['Top', 'Bottom', 'Shoes', 'One-piece', 'Outerwear']; // Example category options
const subcategoryOptions = ['T-shirt', 'Blouse', 'Sweater', 'Dress', 'Jumpsuit', 'Skirt', 'Pants', 'Shorts', 'Jeans', 'Sneakers', 'Sandals', 'Boots', 'Jacket', 'Coat']; // Example subcategory options
const weatherOptions = ['Hot', 'Cold']; // Example weather options
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
        enum: styleOptions,
    },
    color: {
        type: String,
        required: true,
        enum: colorOptions,
    },
    wearableWeather: {
        type: String,
        required: true,
        enum: weatherOptions,
    },
    category: { // top, bottom, shoes, one-piece, accessory, outerwear
        type: String,
        required: true,
        enum: categoryOptions,
    },
    subcategory: { // t-shirt, blouse, dress, skirt, pants, shorts, jeans, sneakers, sandals, boots, hat, scarf, jacket, coat, etc.
        type: String,
        required: true,
        enum: subcategoryOptions,
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