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
        //console.log('outfit in romantic:', outfit);
 
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
    //console.log('CAME TO CREATE OUTFIT IN ROMANTIC STRATEGY');
    const one_piece = getRandomItemByColorAndType(clothingItems, colors, 'One-piece');
    const top = getRandomItemByColorAndType(clothingItems, colors, 'Top');
    const bottom = getRandomItemByColorAndType(clothingItems, colors, 'Bottom');
    const shoe = getRandomItemByColorAndType(clothingItems, colors, 'Shoes');
    const outerwear = getRandomItemByColorAndType(clothingItems, colors, 'Outerwear');

    let outfits = [];

    if (one_piece && shoe) {
        //console.log('CAME TO ONEPİECE AND SHOEEE')
        //console.log('one_piece:', one_piece.category);
        //console.log('shoe:', shoe.category);
        let outfit_op1_items = [
            { id: one_piece._id, imageUrl: one_piece.imageUrl, category: one_piece.category },
            { id: shoe._id, imageUrl: shoe.imageUrl, category: shoe.category},
        ];
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

        outfits.push(outfit_op1);
    }

    if (top && bottom && shoe) {
        //console.log('CAME TO TOP AND BOTTOM AND SHOEEE')
        //console.log('top:', top.category);
        //console.log('bottom:', bottom.category);
        //console.log('shoe:', shoe.category);
        let outfit_op2_items = [
            { id: top._id, imageUrl: top.imageUrl, category: top.category},
            { id: bottom._id, imageUrl: bottom.imageUrl , category: bottom.category},
            { id: shoe._id, imageUrl: shoe.imageUrl , category: shoe.category},
        ];
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

    const desiredColors = ['Red', 'Blue', 'White', 'Yellow', 'Green'];
    // filter 
    const filteredItems = clothingItems.filter(item => {
        return item.wearableWeather.includes(dayWeather) 
            && (item.style === 'Casual' || item.style === 'Formal' || item.style === 'Evening')
            && (item.category === 'Top' || item.subcategory === 'Skirt' || item.category === 'Shoes' || item.category === 'One-piece' || item.category === 'Outerwear')
            && item.color.some(color => desiredColors.includes(color))
            && item.isClean !== false;
    });

    return filteredItems;
}
module.exports = RomanticOutfitStrategy;

