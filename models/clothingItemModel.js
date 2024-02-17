/*Cothing Item Model:
    * Attributes:
    * itemId: Unique identifier for each clothing item.
    * itemName: Name or description of the clothing item.
    * itemType: Category or type of the clothing item (e.g., shirt, pants, shoes).
    * itemColor: options will be set
    * itemImage: Image or reference to an image of the clothing item. (Url)
    * isClean: Boolean indicating whether the item is clean or dirty.
    * isFavorite: Boolean indicating whether the item is favorite or not. */
const mongoose = require("mongoose");
const clothingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
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
        type: String,
        required: false,    
    },
});