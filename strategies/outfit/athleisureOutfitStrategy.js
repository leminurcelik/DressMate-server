const baseOutfitStrategy = require('./baseOutfitStrategy');
const ClothingItem = require('../../controllers/clothingItem');
const Outfit = require("../../models/outfitModel");
const weather = require('../../controllers/weather');

class AthleisureOutfitStrategy extends baseOutfitStrategy {
    async generateOutfit(userId, options) {
        // get the weather data
        const weatherData = await weather.getTemperature(options.location, options.date, options.time);

        // filter the clothing items by the weather and style
        const filteredItems = await filterItems(userId, options);

        

        // create the outfit
        let outfit;
        let attempts = 0;
        const maxAttempts = 3; // Maximum number of attempts to generate an outfit

        while (!outfit && attempts < maxAttempts) {
            // get 3 random colors     
            const selectedColors = getRandomColors(filteredItems, 3);
            try {
                outfit = createOutfit(filteredItems, selectedColors, weatherData.temperature, weatherData.condition);
            } catch (error) {
                attempts++;
            }
        }

        if (!outfit) {
            throw new Error('Could not create any outfits after ' + maxAttempts + ' attempts');
        }

        return outfit;
    }
}


const getRandomColors = (items, count) => {
    const allColors = items.map(item => item.color);

    const colors = [];
    while (colors.length < count) {
        const color = allColors[Math.floor(Math.random() * allColors.length)];
            colors.push(color);
    }
    //console.log('colors:', colors);
    return colors;
}

function createOutfit(clothingItems, colors, temp, condition) {
    const one_piece = getRandomItemByColorAndType(clothingItems, colors, 'One-piece');
    const top = getRandomItemByColorAndType(clothingItems, colors, 'Top');
    const bottom = getRandomItemByColorAndType(clothingItems, colors, 'Bottom');
    const shoe = getRandomItemByColorAndType(clothingItems, colors, 'Shoes');
    const outerwear = getRandomItemByColorAndType(clothingItems, colors, 'Outerwear');

    let outfits = [];

    if (one_piece && shoe) {
        let outfit_op1_items = [
            { id: one_piece._id, imageUrl: one_piece.imageUrl },
            { id: shoe._id, imageUrl: shoe.imageUrl },
        ];
        if (outerwear) {
            outfit_op1_items.push({ id: outerwear._id, imageUrl: outerwear.imageUrl });
        }

        let outfit_op1 = new Outfit({
            name: `${one_piece.name} outfit`,
            items: outfit_op1_items,
            weatherTemperature: temp,
            weatherCondition: condition,
            strategy: 'athleisure'
        });

        outfits.push(outfit_op1);
    }

    if (top && bottom && shoe) {
        let outfit_op2_items = [
            { id: top._id, imageUrl: top.imageUrl, category: top.category},
            { id: bottom._id, imageUrl: bottom.imageUrl, category: bottom.category},
            { id: shoe._id, imageUrl: shoe.imageUrl, category: shoe.category},
        ];
        if (outerwear) {
            outfit_op2_items.push({ id: outerwear._id, imageUrl: outerwear.imageUrl, category: outerwear.category});
        }

        let outfit_op2 = new Outfit({
            name: `${top.name} - ${bottom.name} outfit`,
            items: outfit_op2_items,
            weatherTemperature: temp,
            weatherCondition: condition,
            strategy: 'athleisure'
        });

        outfits.push(outfit_op2);
    }

    if (outfits.length === 0) {
        throw new Error('Could not create any outfits');
    }

    //randomly choosing one of the outfits
    let randomIndex = Math.floor(Math.random() * outfits.length);
    return outfits[randomIndex];
}


function getRandomItemByColorAndType(clothingItems, colors, type) {
    let items = clothingItems.filter(item => {
        return colors.flat().includes(item.color[0]) && item.category === type;
    });

    // Get favorite items
    const favoriteItems = items.filter(item => item.isFavorite);
    console.log('favoriteItems:', favoriteItems);
    // Duplicate favorite items to increase their chance of being selected
    items = items.map(item => favoriteItems.includes(item) ? [item, item] : [item]).flat();

    if (items.length === 0) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

function getItemsByColorAndType(clothingItems, colors, type) {
    const items = clothingItems.filter(item => {
        return item.color.some(color => colors.flat().includes(color)) && item.category === type;
    });

    return items;
}

async function filterItems(userId, options) {
            // get the weather data
            const weatherData = await weather.getTemperature(options.location, options.date, options.time);

            // get the clothing items of the user
            const clothingItems = await ClothingItem.getAllClothingItems(userId);
    
            // get the temperature
            const temp = weatherData.temperature;
    
            // get the weather condition
            let dayWeather;
            if (temp >= 15 ) {
                dayWeather = "Hot";
            }
            else {
                dayWeather = "Cold";
            }
    
            // filter the clothing items by the weather and style
            const filteredItems = clothingItems.filter(item => {
                if (!item.wearableWeather.includes(dayWeather) || item.isClean === false) {
                    return false;
                }
            
                switch (item.category) {
                    case 'One-piece':
                        return item.style === 'Sportswear' || item.style === 'Casual';
                    case 'Top':
                        return item.style === 'Casual' || item.style === 'Sportswear';
                    case 'Bottom':
                        return item.style === 'Sportswear';
                    case 'Shoes':
                        return item.style === 'Casual' || item.style === 'Sportswear';
                    case 'Outerwear':
                        return item.style === 'Formal' || item.style === 'Casual';
                    default:
                        return false;
                }
            });
            return filteredItems;
    
}
module.exports = AthleisureOutfitStrategy;