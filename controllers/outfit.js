/* 
get by id
get all issaved==true 
const getItemsByCategory = async (category, page, limit) => {
    try {
        const result = await ClothingItem.find({ category: category }).skip((page - 1) * limit).limit(limit);
        return result;
    }   
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}  
*/


const OutfitGeneratorFactory = require('../factories/outfitGeneratorFactory');
const User = require("../models/userModel");
const Outfit = require("../models/outfitModel");

const generateOutfit = async (userId, options) => {
    try {
        const outfitGenerator = await OutfitGeneratorFactory.createOutfitGenerator(userId, options);
        const result = await outfitGenerator.generateOutfit(userId, options);
        return result;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

const saveOutfit = async (userId, outfitInfo) => {
    try {
        const newOutfit = await Outfit.create(outfitInfo); 
        const user = await User.findById(userId);
        user.savedOutfit.push(newOutfit._id);
        const result = await user.save();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

const getSavedOutfits = async (userId) => {
    try {
        console.log('getSavedOutfits');
        console.log('userId:', userId);
        const user = await User.findById(userId);
        const savedOutfits = await Outfit.find({ _id: { $in: user.savedOutfit } });
        console.log('savedOutfits:', savedOutfits);
        return savedOutfits;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

const saveOutfitStatus = async (userId, outfitId) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return 'User not found';
        }
        // Find the cloth by clothing item ID
        const outfit = await Outfit.findById(outfitId);
        if (!outfit) {
            return 'Outfit not found';
        }

        // If the outfit is saved, remove it from saved outfit section
        if (outfit.isSaved && user.savedOutfit.includes(outfitId)) {
            user.savedOutfit.pull(outfitId);
        }
        // If the outfit is not saved, add it to saved outfit section
        else if (!outfit.isSaved && !user.savedOutfit.includes(outfitId)) {
            user.savedOutfit.push(outfitId);
        }
        // Toggle the favorite status of the clothing item
        outfit.isSaved = !outfit.isSaved;
        // Save the updated user document
        await outfit.save();
        const result = await user.save();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}



module.exports = { generateOutfit, saveOutfitStatus, saveOutfit, getSavedOutfits };