/*Outfit Model:
    * Attributes:
    * outfitId: Unique identifier for each outfit.
    * outfitName: Name or description of the outfit.
    * outfitItems: Array of clothing items that make up the outfit.
    * isSaved: Boolean indicating whether the user saved the outfit. 
    * weather  */
const mongoose = require("mongoose");
const weatherCondition = require("./weatherModel.js");
const outfitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    items: {
        type: [clothingItem.schema], 
        required: true,
    },
    isSaved: {
        type: Boolean,
        required: true,
        default: false,
    },
    weather: {
        type: weatherCondition.schema,
        required: true,
    },

});
