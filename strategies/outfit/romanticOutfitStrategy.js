const baseOutfitStrategy = require('./baseOutfitStrategy');
const ClothingItem = require('../../controllers/clothingItem');
const Outfit = require("../../models/outfitModel");
const weather = require('../../controllers/weather');

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
    //console.log('came to romanticFilter');
    //console.log('options:', options);

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
    let styleOptions;
    switch (options.style) {
    case 'Evening':
        styleOptions = ['Formal', 'Evening'];
        break;
    case 'Sportswear':
    case 'Casual':
        styleOptions = ['Casual', 'Sportswear'];
        break;
    case 'Formal':
        styleOptions = ['Formal'];
        break;
    default:
        styleOptions = [];
    }
    //console.log('dayWeather:', dayWeather);

    // filter 
    const filteredItems = clothingItems.filter(item => {
        if (item.category === 'Shoes') {
            if (options.style === 'Evening' && item.style !== 'Evening') {
                return false;
            }
            if (options.style === 'Formal' && item.style !== 'Evening' && item.style !== 'Formal') {
                return false;
            }
            if (item.isClean === false) {
                return false;
            }
        } else if (!item.wearableWeather.includes(dayWeather) 
            || !styleOptions.includes(item.style)
            || !(item.category === 'Top' || item.subcategory === 'Skirt' || item.category === 'One-piece' || item.category === 'Outerwear')
            || item.isClean === false) {
            return false;
        }
    
        return true;
    });

    return filteredItems;
}
module.exports = RomanticOutfitStrategy;

