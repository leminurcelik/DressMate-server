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

const User = require("../models/userModel");
const Outfit = require("../models/outfitModel");
const OutfitGenerator = require('../generators/outfitGenerator');

const generateOutfit = async (userId, options) => {
    try {
        const outfitGenerator = new OutfitGenerator(userId, options);
        const result = await outfitGenerator.generateOutfit();
        console.log('result:', result);
        return result;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

const saveOutfit = async (userId, outfitInfo) => {
    try {
        console.log('saveOutfit info', outfitInfo);  

        const user = await User.findById(userId).populate('savedOutfit');
        console.log('user:', user);

        // Check if the outfit has been saved before
        const isOutfitSaved = user.savedOutfit.some(savedOutfit => {
            // Convert item IDs to strings for comparison
            const newOutfitItems = outfitInfo.items.map(item => item.id.toString());
            const savedOutfitItems = savedOutfit.items.map(item => item.id.toString());

            // Sort the arrays and convert them to strings for comparison
            return JSON.stringify(newOutfitItems.sort()) === JSON.stringify(savedOutfitItems.sort());
        });

        if (isOutfitSaved) {
            console.log('This outfit has been saved before.');
            return null;
        }

        console.log('saveOutfit info', outfitInfo);  
        const newOutfit = await Outfit.create(outfitInfo); 
        newOutfit.isSaved = true;
        await newOutfit.save(); 
        //const user = await User.findById(userId);
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
        const savedOutfits = await Outfit.find({ _id: { $in: user.savedOutfit }, isSaved: true });
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