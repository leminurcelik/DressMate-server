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
            category: clothingItemData.category,
            subcategory: clothingItemData.subcategory,
            color: clothingItemData.color,
            imageUrl: clothingItemData.imageUrl,
            isFavorite: false,
            isClean: true,
            name: clothingItemData.name,
            pattern: clothingItemData.pattern,
            style: clothingItemData.style,
            wearableWeather: clothingItemData.wearableWeather,
            details: clothingItemData.details,
        });
        const result = await newItem.save();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// add multiple clothing items
const addClothingItems = async (userId, clothingItemsData) => {
    try {
        const newItemsPromises = clothingItemsData.map(async (itemData) => {
            const newItem = await ClothingItem.create({
                userId: userId,
                category: itemData.category,
                subcategory: itemData.subcategory,
                color: itemData.color,
                imageUrl: itemData.imageUrl,
                isFavorite: false,
                isClean: true,
                name: itemData.name,
                pattern: itemData.pattern,
                style: itemData.style,
                wearableWeather: itemData.wearableWeather,
                details: itemData.details,
            });
            return newItem.save();
        });

        const results = await Promise.all(newItemsPromises);
        return results;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// update clothing item
const updateClothingItem = async (userId, clothingItemId, clothingItemData) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Find the cloth by clothing item ID
        const cloth = await ClothingItem.findById(clothingItemId);
        if (!cloth) {
            throw new Error('Clothing item not found');
        }

        // Update the clothing item properties
        for (let key in clothingItemData) {
            if (cloth[key] !== undefined) {
                cloth[key] = clothingItemData[key];
            } else {
                throw new Error(`Invalid property: ${key}`);
            }
        }

        // Save the updated clothing item document
        try {
            const result = await cloth.save();
            return result;
        } catch (error) {
            console.error('Validation error:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}        


// delete clothing item
const deleteClothingItem = async (userId, clothingItemId) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Find the clothing item by ID
        const cloth = await ClothingItem.findById(clothingItemId);
        if (!cloth) {
            throw new Error('Clothing item not found');
        }

        // Check if the clothing item belongs to the user
        if (String(cloth.userId) !== userId) {
            throw new Error('Clothing item does not belong to the user');
        }

        // Find the clothing item by ID and delete it
        const result = await ClothingItem.deleteOne({ _id: clothingItemId });
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// change favorite status of a clothing item
const favoriteStatus = async (userId, clothingItemId) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return 'User not found';
        }
        // Find the cloth by clothing item ID
        const cloth = await ClothingItem.findById(clothingItemId);
        if (!cloth) {
            return 'Clothing item not found';
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

// change laundry status of a clothing item
const laundryStatus = async (userId, clothingItemId) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return 'User not found';
        }
        // Find the cloth by clothing item ID
        const cloth = await ClothingItem.findById(clothingItemId);
        if (!cloth) {
            return 'Clothing item not found';
        }

        // If the clothing item is clean, add it to laundry basket and change the clean status to false
        if (cloth.isClean && !user.laundryBasket.includes(clothingItemId)) {
            user.laundryBasket.push(clothingItemId);
        }
        // If the clothing item is not clean, remove it from laundry basket and change the clean status to true
        else if (!cloth.isClean && user.laundryBasket.includes(clothingItemId)) {
            user.laundryBasket.pull(clothingItemId);
        }
        // Toggle the clean status of the clothing item
        cloth.isClean = !cloth.isClean;
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

//get items in laundry basket
const getItemsInLaundryBasket = async (userId, page, limit) => {
    try {
        const result = await ClothingItem.find({ userId: userId, isClean: false }).skip((page - 1) * limit).limit(limit);
        return result;
    }   
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}

//get items in favorites
const getItemsInFavorites = async (userId, page, limit) => {
    try {
        const result = await ClothingItem.find({ userId: userId, isFavorite: true }).skip((page - 1) * limit).limit(limit);
        return result;
    }   
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}

//get items that are clean
const getItemsClean = async (userId, page, limit) => {
    try {
        const result = await ClothingItem.find({ userId: userId, isClean: true }).skip((page - 1) * limit).limit(limit);
        return result;
    }   
    catch (error) {
        console.error('Error:', error);
        return null;
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

const suggestClothingItemDetails = async (userId, imageUrl) => {
    try {
        // Use the Google Vision API to analyze the image
        const [result] = await client.labelDetection(imageUrl);
        const labels = result.labelAnnotations;

        // Map the labels to your clothing categories and subcategories
        const category = mapToCategory(labels);
        const subcategory = mapToSubcategory(labels);

        // Create a new item with the suggested details
        const newItem = new ClothingItem({
            userId: userId,
            category: category,
            subcategory: subcategory,
            imageUrl: imageUrl,
            isFavorite: false,
            isClean: true,
        });

        // Return the new item without saving it to the database
        return newItem;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function mapToCategory(labels) {
    // Implement your mapping logic here
}

function mapToSubcategory(labels) {
    // Implement your mapping logic here
}
module.exports = { addClothingItem, updateClothingItem, getItemsByCategory, getItemsBySubcategory, getItemsById, getAllClothingItems, favoriteStatus, laundryStatus, deleteClothingItem, addClothingItems, suggestClothingItemDetails, getItemsInLaundryBasket, getItemsInFavorites, getItemsClean};
