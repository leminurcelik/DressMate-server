const baseOutfitStrategy = require('./baseOutfitStrategy');
const ClothingItem = require('../../controllers/clothingItem');
const Outfit = require("../../models/outfitModel");
const weather = require('../../controllers/weather');
const { weatherOptions } = require('../../config/clothingItemOptions');

//itemler fiilterdan gelecek
// bir etek üst ve bir onepiece olarak kombin yapılacak (favori bi itemi varsa seçeneklerden o seçilecek)
// random 3 renk seçmek yerine önce üst / (diğer strateji için de one piece) seçilecek
// üste alt seçerken ya uyumlu ya da aynı renk seçilecek
// alt üst rengi aynıysa (ayakkabı ceket aynı ancak alt üstten farklı olabilir), ya da hepsi aynı olacak
// onepieceli olanda da, ayakkabı ceket aynı olacak ya da hepsi aynı olacak 
//ceket yoksa ya üst ve ayakkabı aynı renk (bold olan biri için başka bir renk)
// ceket alt , üst ayakkabı eşşleşmesi de olabilir

class RomanticOutfitStrategy extends baseOutfitStrategy {
    async generateOutfit(userId, options) {
        //console.log('romanticOutfitStrategy');
        // get the weather data
        const weatherData = await weather.getTemperature(options.location, options.date, options.time);
        //console.log('weatherData:', weatherData);

        //const itemFilterGenerator = itemFilterFactory.ItemFilterFactory(userId, options, 'romantic');

        // filter the clothing items by the weather and style
        const filteredItems = await filterItems(userId, options);

        
        let outfit;
        let attempts=0;
        let maxAttempts = 3;
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
        //console.log('outfit in romantic:', outfit);
 
        return outfit;
    }
       
}


function createOutfit(clothingItems, temp, condition) {
    console.log('CAME TO CREATE OUTFIT IN ROMANTIC STRATEGY');
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
                strategy: 'romantic'
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
                    strategy: 'romantic'
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

async function filterItems(userId, options) {
    console.log('CAME TO FILTER ITEMS IN ROMANTIC STRATEGY');
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
    console.log('dayWeather:', dayWeather); 

    let styleOptions;
    switch (options.style) {
    case 'Evening':
        styleOptions = ['Formal', 'Evening'];
        break;
    case 'Sportswear':
        styleOptions = ['Casual', 'Sportswear'];
        break;
    case 'Casual':
        styleOptions = ['Casual'];
        break;
    case 'Formal':
        styleOptions = ['Formal'];
        break;
    default:
        styleOptions = [];
    }

     

    // filter the clothing items by the weather and style
    const filteredItems = clothingItems.filter(item => {

       /*  if (item.category === 'Shoes' && options.style === 'Evening') {
            return item.style === 'Evening';
        }
        if (item.category === 'Shoes' && options.style === 'Formal') {
            return item.style === 'Evening' || item.style=='Formal';
        } */

        const weatherOptions = ['Cold', 'Cool', 'Warm', 'Hot'];
        const dayWeatherIndex = weatherOptions.indexOf(dayWeather);
        const hotterWeather = weatherOptions[dayWeatherIndex + 1]; // get the one level hotter weather
        
        // For outerwear, it should directly include dayWeather
        if (item.category === 'Outerwear' && !item.wearableWeather.includes(dayWeather)) {
            return false;
        }

        // For other categories, it should include items that are labeled with the same weather or one level hotter
        if (item.category !== 'Outerwear' && !(item.wearableWeather.includes(dayWeather) || (hotterWeather && item.wearableWeather.includes(hotterWeather)))) {
            return false;
        }

        // check style and cleanliness for all items
        if (!styleOptions.includes(item.style) || !item.isClean) {
            return false;
        }

        // filter out items with certain fabrics when it's raining or snowing
        if ((weatherData.condition.includes('rain') || weatherData.condition.includes('snow')) && ['Textile', 'Suede', 'Canvas'].includes(item.details.Fabric)) {
            return false;
        }

        // filter out items that are not boots when it's snowing
        if (weatherData.condition.includes('snow') && item.category === 'Shoes' && item.subCategory !== 'Boots') {
            return false;
        }

        // check if the item's category is 'Top', 'Shoes', 'One-piece', 'Outerwear', or if the item's subcategory is 'Skirt'
        if (!(item.category === 'Top' || item.subcategory === 'Skirt' || item.category === 'Shoes' || item.category === 'One-piece' || item.category === 'Outerwear')) {
            return false;
        }

        return true;

    
    });
    
    //console.log('filteredItems in romantic:', filteredItems);
    return filteredItems;
}
module.exports = RomanticOutfitStrategy;

