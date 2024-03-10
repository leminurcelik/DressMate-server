const Image = require("../models/imageModel");
// add clothing item
const addClothingImage = async (userId, filename, path, originalname) => {
    try {
        // Save image details to MongoDB
        const newImage = await Image.create({
            filename: filename,
            path: path,
            originalname: originalname
        });
        await newImage.save();
       return 'Image uploaded succesfully';
    } catch (error) {
        return ('Error uploading image:', error);
    }
}
module.exports = { addClothingImage };
