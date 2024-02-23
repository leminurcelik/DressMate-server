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
module.exports = { generateOutfit };