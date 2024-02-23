/*
get by category (all items) pagination
*/
const ClothingItem = require("../models/clothingItemModel");
const User = require("../models/userModel");
// add clothing item
const addClothingItem = async (userId, clothingItemData) => {
    try {
        const newItem = await ClothingItem.create({
            userId: userId,
            name: clothingItemData.name,
            style: clothingItemData.style,
            color: clothingItemData.color,
            wearableWeather: clothingItemData.wearableWeather,
            category: clothingItemData.category,
            subcategory: clothingItemData.subcategory,
            imageUrl: clothingItemData.imageUrl,
            isClean: clothingItemData.isClean,
            isFavorite: clothingItemData.isFavorite,
            details: clothingItemData.details,
        });
        const result = await newItem.save();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// change favorite status of a clothing item
const favoriteStatus = async (userId, clothingItemId) => {
    try {
        console.log("User", userId);
        console.log("clothing item id", clothingItemId);
        // Find the user by ID
        const user = await User.findById(userId);
        console.log(user);
        if (!user) {
            throw new Error('User not found');
        }
        const cloth = await ClothingItem.findById(clothingItemId);
        if (!cloth) {
            throw new Error('Cloth not found');
        }

        // If the cloth is already in favorites, remove it
        if (cloth.isFavorite && user.favoriteClothingItems.includes(clothingItemId)) {
            user.favoriteClothingItems.pull(clothingItemId);
        }
        // If the cloth is not in favorites, add it
        else if (!cloth.isFavorite && !user.favoriteClothingItems.includes(clothingItemId)) {
            user.favoriteClothingItems.push(clothingItemId);
        }
        // Toggle the favorite status of the clothing item
        cloth.isFavorite = !cloth.isFavorite;
        // Save the updated user document
        await cloth.save();
        const result = await user.save();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

//get all items of user
const getAllClothingItems = async (userId,page, limit) => {
    try {
        const result = await ClothingItem.find({ userId: userId }).skip((page - 1) * limit).limit(limit);
        return result;
    }   
    catch (error) {
        console.error('Error:', error);
        return [];
    }
}

//get items by filtering with color and type


// get items by category
const getItemsByCategory = async (category, userId, page, limit) => {
    try {
        const result = await ClothingItem.find({ category: category, userId: userId }).skip((page - 1) * limit).limit(limit);
        return result;
    }   
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}  

// get items by subcategory
const getItemsBySubcategory = async (subcategory, userId,page, limit) => {
    try {
        const result = await ClothingItem.find({ subcategory: subcategory, userId: userId }).skip((page - 1) * limit).limit(limit);
        return result;
    }   
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// get item by id
const getItemsById = async (itemId, userId) => {
    try {
        const result = await ClothingItem.findOne({ _id: itemId, userId: userId });
        return result;
    }   
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}
module.exports = { addClothingItem, getItemsByCategory, getItemsBySubcategory, getItemsById, getAllClothingItems, favoriteStatus};
