const mongoose = require("mongoose");
// Define image schema
const imageSchema = new mongoose.Schema({
    filename: String,
    path: String,
    originalname: String
});
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;

