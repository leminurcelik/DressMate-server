/*Outfit Model:
    * Attributes:
    * outfitId: Unique identifier for each outfit.
    * outfitName: Name or description of the outfit.
    * outfitItems: Array of clothing items that make up the outfit.
    * isSaved: Boolean indicating whether the user saved the outfit. 
    * weather  */
const mongoose = require("mongoose");
const clothingItem = require("./clothingItemModel");
const outfitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    items: [{
        _id: false, // Don't create an id for each item in the array, since we don't need it I think
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClothingItem',
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
    }],
    isSaved: {
        type: Boolean,
        required: true,
        default: false,
    },
    weatherTemperature: {
        type: Number,
        required: true,
    },
    weatherCondition: {
        type: String,
        required: true,
    },
    strategy: {
        type: String,
        required: true,
    }
});

const Outfit = mongoose.model("Outfit", outfitSchema);
module.exports = Outfit;
