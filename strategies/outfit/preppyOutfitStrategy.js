const baseOutfitStrategy = require('./baseOutfitStrategy');
const ClothingItem = require('../../controllers/clothingItem');
const Outfit = require("../../models/outfitModel");
const weather = require('../../controllers/weather');
const { weatherOptions } = require('../../config/clothingItemOptions');

class PreppyOutfitStrategy extends baseOutfitStrategy {
    async generateOutfit(userId, options) {
        // get the weather data
        const weatherData = await weather.getTemperature(options.location, options.date, options.time);
        console.log('weatherData:', weatherData);

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


async function filterItems(userId, options){
    //console.log('preppyFilterStrategy geldi');
    // get the weather data
    const weatherData = await weather.getTemperature(options.location, options.date, options.time);
    console.log('weatherData:', weatherData);

    // get the clothing items of the user
    const clothingItems = await ClothingItem.getAllClothingItems(userId);
    //console.log('clothingItems:', clothingItems);

    // get the temperature
    const temp = weatherData.temperature;

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
    //console.log('dayWeather:', dayWeather); 

    let styleOptions;
    switch (options.style) {
    case 'Evening':
        styleOptions = ['Formal', 'Evening'];
        break;
    case 'Casual':
        styleOptions = ['Casual', 'Formal'];
        break;
    case 'Formal':
        styleOptions = ['Formal'];
        break;
    default:
        styleOptions = [];
    }

    // filter the clothing items by the weather and style
    const filteredItems = clothingItems.filter(item => {
        // items can be labeled with the same weather or one level hotter
        const weatherOptions = ['Cold', 'Cool', 'Warm', 'Hot'];
        const dayWeatherIndex = weatherOptions.indexOf(dayWeather);
        const hotterWeather = weatherOptions[dayWeatherIndex + 1]; // get the one level hotter weather

        // For outerwear, it should directly include dayWeather
        if (item.category === 'Outerwear' && !item.wearableWeather.includes(dayWeather)) {
            return false;
        }

        if (item.category === 'Shoes' && item.style == 'Sportswear') {
            return false;
        }   

        // For other categories, it should include items that are labeled with the same weather or one level hotter
        if (item.category !== 'Outerwear' && item.wearableWeather && !(item.wearableWeather.includes(dayWeather) || (hotterWeather && item.wearableWeather.includes(hotterWeather)))) {
            return false;
        }

        // check style and cleanliness for all items
        if (!styleOptions.includes(item.style) || !item.isClean) {
            return false;
        }

        // filter out items with certain fabrics when it's raining or snowing
        if (weatherData && weatherData.condition && (weatherData.condition.includes('rain') || weatherData.condition.includes('snow')) && ['Textile', 'Suede', 'Canvas'].includes(item.details.Fabric)) {
            return false;
        }

        // filter out items that are not boots when it's snowing
        if (weatherData && weatherData.condition && weatherData.condition.includes('snow') && item.category === 'Shoes' && item.subcategory !== 'Boots') {
            return false;
        }

        return true;
    });

    //console.log('filteredItems in preppy:', filteredItems);
    return filteredItems;  
}



function createOutfit(clothingItems, temp, condition) {
    //console.log('CAME TO CREATE OUTFIT IN preppy STRATEGY');
    let outfits = [];
    let colors = [];

    const one_piece = getRandomItemByType(clothingItems, 'One-piece');
    if (one_piece) {
        //console.log('one_piece found');
        colors.push(...one_piece.color);
        //console.log(colors);
        const shoe = getRandomItemByColorAndType(clothingItems, colors, 'Shoes');
        if (shoe) {
            shoe.color.forEach(color => {
                if (!colors.includes(color)) {
                    colors.push(color);
                }
            });
            //console.log('shoe found');
            //console.log(shoe.color)
            //console.log(colors);
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
                strategy: 'preppy'
            });
            //console.log('outfit_op1:', outfit_op1);
            outfits.push(outfit_op1);
        }
    }

    colors = [];
    const top = getRandomItemByType(clothingItems, 'Top');
    if (top) {
        colors.push(...top.color);
        //console.log('top found');
        //console.log(top.color);
        //console.log(colors);
        const bottom = getRandomItemByColorAndType(clothingItems, colors, 'Bottom');
        if (bottom) {
            bottom.color.forEach(color => {
                if (!colors.includes(color)) {
                    colors.push(color);
            }
            });
            //console.log('bottom found');
            //console.log(bottom.color);
            //console.log(colors);
            const shoe = getRandomItemByColorAndType(clothingItems, colors, 'Shoes');
            if (shoe) {
                shoe.color.forEach(color => {
                    if (!colors.includes(color)) {
                        colors.push(color);
                    }
                });
                //console.log('shoe found');
                //console.log('shoe color: ',shoe.color);
                //console.log(colors);
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
                    strategy: 'preppy'
                });
                //console.log('outfit_op2:', outfit_op2);
                outfits.push(outfit_op2);
            }
        }
    }

    if (outfits.length === 0) {
        throw new Error('Could not create any outfits');
    }

    //randomly choosing one of the outfits
    //let randomIndex = Math.floor(Math.random() * outfits.length);
    return outfits;
}

function getRandomItemByType(clothingItems, type) {
    let items = clothingItems.filter(item => item.category === type);
    if (items.length === 0) {
        return undefined;
    }

    let favoriteItems = items.filter(item => item.isFavorite);
    let nonFavoriteItems = items.filter(item => !item.isFavorite);

    let randomIndex;
    if (favoriteItems.length > 0 && Math.random() < 0.7) {
        randomIndex = Math.floor(Math.random() * favoriteItems.length);
        return favoriteItems[randomIndex];
    } else {
        randomIndex = Math.floor(Math.random() * nonFavoriteItems.length);
        return nonFavoriteItems[randomIndex];
    }
}

function getRandomItemByColorAndType(clothingItems, colors, type) {
    let items = clothingItems.filter(item => {
        if (item.category !== type) {
            return false;
        }

        let newColors = [...colors, ...item.color];
        let uniqueColors = [...new Set(newColors)];

        return uniqueColors.length <= 3;
    });

    if (items.length === 0) {
        return undefined;
    }

    let favoriteItems = items.filter(item => item.isFavorite);
    let nonFavoriteItems = items.filter(item => !item.isFavorite);

    let randomIndex;
    if (favoriteItems.length > 0 && Math.random() < 0.7) {
        randomIndex = Math.floor(Math.random() * favoriteItems.length);
        return favoriteItems[randomIndex];
    } else {
        randomIndex = Math.floor(Math.random() * nonFavoriteItems.length);
        return nonFavoriteItems[randomIndex];
    }
}



module.exports = PreppyOutfitStrategy;