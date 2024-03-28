const vision = require('@google-cloud/vision');

const CONFIG_VISION = require('../config/config').CONFIG_VISION;

const axios = require('axios');

// Pass the CONFIG_VISION object to the ImageAnnotatorClient constructor
const client = new vision.ImageAnnotatorClient({
    credentials: {
        private_key: CONFIG_VISION.credentials.private_key,
        client_email: CONFIG_VISION.credentials.client_email
    }
});


const suggestClothingItemDetails = async (userId, imageUrl) => {
    try {
        // Download the image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        const request = {
            image: {content: imageBuffer},
            features: [
                { type: 'OBJECT_LOCALIZATION' },
                { type: 'IMAGE_PROPERTIES' },
            ],
        };

        const [result] = await client.annotateImage(request);

        // Extract object localization
        const objects = result.localizedObjectAnnotations;


        // Create a mapping of subcategories to categories
        const categoryMapping = {
            'T-shirt': 'Top',
            'Blouse': 'Top',
            'Sweater': 'Top',
            'Pants': 'Bottom',
            'Short': 'Bottom',
            'Jeans': 'Bottom',
            'Skirts': 'Bottom',
            'Sneakers': 'Shoes',
            'Sandals': 'Shoes',
            'Boots': 'Shoes',
            'Dress': 'One-piece',
            'Jumpsuit': 'One-piece',
            'Jacket': 'Outerwear',
            'Coat': 'Outerwear',
            'Shoe': 'Shoes',
            'Boot': 'Shoes',
        };


        let detectedCategory = null;
        let detectedSubcategory = null;
        let detectedColors = [];

        // Extract dominant colors
        const colors = result.imagePropertiesAnnotation.dominantColors.colors;
        colors.forEach(color => {
            detectedColors.push(color.color);
        });

        for (let i = 0; i < objects.length; i++) {
            const objectName = objects[i].name;
            if (objectName === 'Top' || objectName === 'Bottom' || objectName === 'Shoes' || objectName === 'One-piece' || objectName === 'Outerwear') {
                detectedCategory = objectName;
            } else if (categoryMapping[objectName]) {
                detectedCategory = categoryMapping[objectName];
                detectedSubcategory = objectName;
            }
        }

        let color = getColorBucket(rgbToHsl(detectedColors[0].red, detectedColors[0].green, detectedColors[0].blue));

        return { category: detectedCategory, subcategory: detectedSubcategory, color: color};
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function getColorBucket(hsl) {
    const h = hsl[0] * 360;  // Convert to degrees
    const s = hsl[1];
    const l = hsl[2];

    if (l < 0.16) return 'Black';
    if (l > 0.9) return 'White';

    if (h < 30) return 'Red';
    if (h < 90) return 'Yellow';
    if (h < 150) return 'Green';
    if (h < 240) return 'Blue';
    if (h < 330) return 'Pink';
    return 'Red';  // For h >= 330
}

module.exports = { suggestClothingItemDetails, rgbToHsl, getColorBucket};