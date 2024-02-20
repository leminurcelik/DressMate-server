/*
get by category (all items) pagination
*/
const ClothingItem = require("../models/clothingItemModel");
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
module.exports = { addClothingItem, getItemsByCategory, getItemsBySubcategory, getItemsById, getAllClothingItems};
