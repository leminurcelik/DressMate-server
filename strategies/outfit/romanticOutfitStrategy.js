const baseOutfitStrategy = require('./baseOutfitStrategy');
const ClothingItem = require('../../controllers/clothingItem');
const Outfit = require("../../models/outfitModel");
const weather = require('../../controllers/weather');
const itemFilterFactory = require('../../factories/itemFilterFactory');

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
        console.log('romanticOutfitStrategy');
        // get the weather data
        const weatherData = await weather.getTemperature(options.location, options.date, options.time);
        console.log('weatherData:', weatherData);

        const itemFilterGenerator = itemFilterFactory.ItemFilterFactory(userId, options, 'romantic');

        // filter the clothing items by the weather and style
        const filteredItems = await itemFilterGenerator.filterItems(userId, options);


        //console.log('filteredItems:', filteredItems);
        // get 3 random colors     
        const selectedColors = getRandomColors(filteredItems, 3);

        
        let outfit;
        outfit = createOutfit(filteredItems,selectedColors, weatherData.temperature, weatherData.condition);
        console.log('outfit in romantic:', outfit);

        
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
            items: outfit_op1_items,
            weatherTemperature: temp,
            weatherCondition: condition,
        });

        outfits.push(outfit_op1);
    }

    if (top && bottom && shoe) {
        let outfit_op2_items = [
            { id: top._id, imageUrl: top.imageUrl },
            { id: bottom._id, imageUrl: bottom.imageUrl },
            { id: shoe._id, imageUrl: shoe.imageUrl },
        ];
        if (outerwear) {
            outfit_op2_items.push({ id: outerwear._id, imageUrl: outerwear.imageUrl });
        }

        let outfit_op2 = new Outfit({
            items: outfit_op2_items,
            weatherTemperature: temp,
            weatherCondition: condition,
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
    const items = clothingItems.filter(item => {
        return colors.flat().includes(item.color[0]) && item.category === type;
    });

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
module.exports = RomanticOutfitStrategy;

