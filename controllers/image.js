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
            'Shorts': 'Bottom',
            'Jeans': 'Bottom',
            'Skirt': 'Bottom',
            'Sneakers': 'Shoes',
            'Sandals': 'Shoes',
            'Boots': 'Shoes',
            'Dress': 'One-piece',
            'Jumpsuit': 'One-piece',
            'Jacket': 'Outerwear',
            'Coat': 'Outerwear',
        };

        let detectedCategory = null;
        let detectedSubcategory = null;

        objects.forEach(object => {
            const objectName = object.name;
            if (categoryMapping[objectName]) {
                detectedCategory = categoryMapping[objectName];
                detectedSubcategory = objectName;
            }
        });

        // Extract dominant colors
        const colors = result.imagePropertiesAnnotation.dominantColors.colors;
        colors.forEach(color => {
            console.log(`Color: ${color.color}`);
            console.log(`Score: ${color.score}`);
        });

        return { category: detectedCategory, subcategory: detectedSubcategory };
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

    return { h: h * 360, s: s * 100, l: l * 100 };
}

function getColorBucket(h, s, l) {
    if (s < 20) return 'gray';
    if (l < 30) return 'black';  // Lowered lightness threshold for 'black'
    if (l > 80) return 'white';
    if (h < 30) return 'red';
    if (h < 60) return 'orange';
    if (h < 90) return 'yellow';
    if (h < 150) return 'green';
    if (h < 210) return 'cyan';
    if (h < 270) return 'blue';
    if (h < 330) return 'purple';
    return 'pink';
}

const color = { red: 240, green: 159, blue: 187 };
const hsl = rgbToHsl(color.red, color.green, color.blue);
const colorBucket = getColorBucket(hsl.h, hsl.s, hsl.l);

console.log(colorBucket);  // Outputs: 'pink'

module.exports = { suggestClothingItemDetails, rgbToHsl, getColorBucket};