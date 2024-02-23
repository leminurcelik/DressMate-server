const baseOutfitStrategy = require('./baseOutfitStrategy');
const ClothingItem = require('../../controllers/clothingItem');
const Outfit = require("../../models/outfitModel");
const weather = require('../../controllers/weather');

class PreppyOutfitStrategy extends baseOutfitStrategy {
    async generateOutfit(userId, options) {
        console.log('preppyOutfitStrategy');

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
            return item.wearableWeather === dayWeather &&
                   item.style === options.style
        });
        // get 3 random colors     
        const selectedColors = getRandomColors(filteredItems, 3);

        // create the outfit
        let outfit;
        if (temp<= 15) {
            outfit = createColdWeatherOutfit(clothingItems,selectedColors, weatherData.temperature, weatherData.condition);
        } else {
            outfit = createHotWeatherOutfit(clothingItems,selectedColors, weatherData.temperature, weatherData.condition);
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
    console.log('colors:', colors);
    return colors;
}

function createColdWeatherOutfit(clothingItems,colors, temp, condition) {
    const top = getRandomItemByColorAndType(clothingItems,colors, 'Top');
    const bottom = getRandomItemByColorAndType(clothingItems,colors, 'Bottom');
    const shoe = getRandomItemByColorAndType(clothingItems,colors, 'Shoes');
    const outerwear = getRandomItemByColorAndType(clothingItems,colors, 'Outerwear');

    return new Outfit({
        name: `Cold Weather ${condition} - ${colors.join(', ')} Outfit`,
        items: [
            { id: top._id, imageUrl: top.imageUrl },
            { id: bottom._id, imageUrl: bottom.imageUrl },
            { id: shoe._id, imageUrl: shoe.imageUrl },
            { id: outerwear._id, imageUrl: outerwear.imageUrl },
        ],
        weatherTemperature: temp,
        weatherCondition: condition,
    });
    
}

function createHotWeatherOutfit(clothingItems,colors, temp, condition) {
    const onePiece = getRandomItemByColorAndType(clothingItems,colors, 'One-piece');
    const shoe = getRandomItemByColorAndType(clothingItems,colors, 'Shoes');
    const outerwear = getRandomItemByColorAndType(clothingItems,colors, 'Outerwear');
    
    return new Outfit({
        name: `Hot Weather ${condition} - ${colors.join(', ')}   Outfit`,
        items: [
            { id: onePiece._id, imageUrl: onePiece.imageUrl },
            { id: shoe._id, imageUrl: shoe.imageUrl },
            { id: outerwear._id, imageUrl: outerwear.imageUrl },
        ],
        weatherTemperature: temp,
        weatherCondition: condition, 
    });
}

function getRandomItemByColorAndType(clothingItems, colors, type) {
    const items = clothingItems.filter(item => {
        return colors.includes(item.color) && item.category === type;
    });

    if (items.length === 0) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}
module.exports = PreppyOutfitStrategy;