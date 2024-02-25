const baseOutfitStrategy = require('./baseOutfitStrategy');
const ClothingItem = require('../../controllers/clothingItem');
const Outfit = require("../../models/outfitModel");
const weather = require('../../controllers/weather');

class TomboyOutfitStrategy extends baseOutfitStrategy {
    async generateOutfit(userId, options) {

        // get the weather data
        const weatherData = await weather.getTemperature(options.location, options.date, options.time);
        console.log('weatherData:', weatherData);

        const itemFilterGenerator = itemFilterFactory.ItemFilterFactory(userId, options, 'tomboy');

        // filter the clothing items by the weather and style
        const filteredItems = await itemFilterGenerator.filterItems(userId, options);
        console.log('filteredItems:', filteredItems);


        //console.log('filteredItems:', filteredItems);
        // get 3 random colors     
        const selectedColors = getRandomColors(filteredItems, 3);

        // create the outfit
        let temp = weatherData.temperature;
        let outfit;
        if (temp<= 15) {
            outfit = createColdWeatherOutfit(filteredItems,selectedColors, weatherData.temperature, weatherData.condition);
        } else {
            outfit = createHotWeatherOutfit(filteredItems,selectedColors, weatherData.temperature, weatherData.condition);
            console.log('outfit:', outfit);
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
module.exports = TomboyOutfitStrategy;