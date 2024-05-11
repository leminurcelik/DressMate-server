const baseOutfitStrategy = require('./baseOutfitStrategy');
const ClothingItem = require('../../controllers/clothingItem');
const Outfit = require("../../models/outfitModel");
const weather = require('../../controllers/weather');
const { weatherOptions } = require('../../config/clothingItemOptions');

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
            try {
                outfit = createOutfit(filteredItems, weatherData.temperature, weatherData.condition);
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

function createOutfit(clothingItems, temp, condition) {
    console.log('CAME TO CREATE OUTFIT IN athleisure STRATEGY');
    let outfits = [];
    let colors = [];

    const one_piece = getRandomItemByType(clothingItems, 'One-piece');
    if (one_piece) {
        console.log('one_piece found');
        colors.push(...one_piece.color);
        console.log(colors);
        const shoe = getRandomItemByColorAndType(clothingItems, colors, 'Shoes');
        if (shoe) {
            shoe.color.forEach(color => {
                if (!colors.includes(color)) {
                    colors.push(color);
                }
            });
            console.log('shoe found');
            console.log(shoe.color)
            console.log(colors);
            let outfit_op1_items = [
                { id: one_piece._id, imageUrl: one_piece.imageUrl, category: one_piece.category },
                { id: shoe._id, imageUrl: shoe.imageUrl, category: shoe.category},
            ];
            const outerwear = getRandomItemByColorAndType(clothingItems, colors, 'Outerwear');
            if (outerwear) {
                outfit_op1_items.push({ id: outerwear._id, imageUrl: outerwear.imageUrl , category: outerwear.category});
            }

            let outfit_op1 = new Outfit({
                name: `${one_piece.name} outfit`,
                items: outfit_op1_items,
                weatherTemperature: temp,
                weatherCondition: condition,
                strategy: 'athleisure'
            });
            console.log('outfit_op1:', outfit_op1);
            outfits.push(outfit_op1);
        }
    }

    colors = [];
    const top = getRandomItemByType(clothingItems, 'Top');
    if (top) {
        colors.push(...top.color);
        console.log('top found');
        console.log(top.color);
        console.log(colors);
        const bottom = getRandomItemByColorAndType(clothingItems, colors, 'Bottom');
        if (bottom) {
            bottom.color.forEach(color => {
                if (!colors.includes(color)) {
                    colors.push(color);
            }
            });
            console.log('bottom found');
            console.log(bottom.color);
            console.log(colors);
            const shoe = getRandomItemByColorAndType(clothingItems, colors, 'Shoes');
            if (shoe) {
                shoe.color.forEach(color => {
                    if (!colors.includes(color)) {
                        colors.push(color);
                    }
                });
                console.log('shoe found');
                console.log('shoe color: ',shoe.color);
                console.log(colors);
                let outfit_op2_items = [
                    { id: top._id, imageUrl: top.imageUrl, category: top.category},
                    { id: bottom._id, imageUrl: bottom.imageUrl , category: bottom.category},
                    { id: shoe._id, imageUrl: shoe.imageUrl , category: shoe.category},
                ];
                const outerwear = getRandomItemByColorAndType(clothingItems, colors, 'Outerwear');
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
                console.log('outfit_op2:', outfit_op2);
                outfits.push(outfit_op2);
            }
        }
    }

    if (outfits.length === 0) {
        throw new Error('Could not create any outfits');
    }

    //randomly choosing one of the outfits
    let randomIndex = Math.floor(Math.random() * outfits.length);
    return outfits[randomIndex];
}

function getRandomItemByType(clothingItems, type) {
    let items = clothingItems.filter(item => item.category === type);
    if (items.length === 0) {
        return undefined;
    }
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

function getRandomItemByColorAndType(clothingItems, colors, type) {
    let items = clothingItems.filter(item => {
        return item.category === type && item.color.some(color => {
            let newColors = [...colors, color];
            let uniqueColors = [...new Set(newColors)];
            return uniqueColors.length <= 3;
        });
    });

    if (items.length === 0) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}


async function filterItems(userId, options) {
    // get the weather data
    const weatherData = await weather.getTemperature(options.location, options.date, options.time);
    console.log('weatherData:', weatherData);

    // get the clothing items of the user
    const clothingItems = await ClothingItem.getAllClothingItems(userId);

    // get the temperature
    const temp = weatherData.temperature;

    // get the weather condition
    let dayWeather;
    console.log('temp:', temp);
    if (temp >= 25 ) {
        dayWeather = "Hot";
    }
    else if (temp >= 15) {
        dayWeather = "Warm";
    }
    else if (temp >= 5) {
        dayWeather = "Cool";
    }
    else {
        dayWeather = "Cold";
    }

    // if the weather is 'Hot or 'Warm', change the category of 'Sweater' and 'Shirt' to 'Outerwear' in the copied array
    if (dayWeather === 'Hot' || dayWeather === 'Warm') {
        clothingItems.forEach(item => {
            if (item.subCategory === 'Sweater' || item.subCategory === 'Shirt') {
                item.category = 'Outerwear';
            }
        });
    }

    // filter the clothing items by the weather and style
    const filteredItems = clothingItems.filter(item => {
        if ( item.isClean === false) {
            return false;
        }

        // filter out blouses
        if (item.subCategory === 'Blouse') {
            return false;
        }

        // filter out shirts when the weather is cold or cool
        if ((dayWeather === 'Cold' || 'Cool') && item.subCategory === 'Shirt') {
            return false;
        }

        // filter out items with certain fabrics when it's raining or snowing
        if ((weatherData.includes('rain') || weatherData.includes('snow')) && ['Textile', 'Suede', 'Canvas'].includes(item.details.Fabric)) {
            return false;
        }

        // filter out items that are not boots when it's snowing
        if (weatherData.includes('snow') && item.category === 'Shoes' && item.subCategory !== 'Boots') {
            return false;
        }

        
        switch (item.category) {
            case 'One-piece':
            case 'Top':
            case 'Bottom':
                // items can be labeled with the same weather or one level hotter
                const itemWeatherIndex = weatherOptions.indexOf(item.wearableWeather);
                const dayWeatherIndex = weatherOptions.indexOf(dayWeather);
                if (!(itemWeatherIndex >= dayWeatherIndex && itemWeatherIndex <= dayWeatherIndex + 1)) {
                    return false;
                }
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
                return item.style === 'Casual';
            default:
                return false;
        }


    });

    return filteredItems;
}
module.exports = AthleisureOutfitStrategy;