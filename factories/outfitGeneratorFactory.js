const OutfitGenerator = require('../generators/outfitGenerator');
const Outfit = require("../models/outfitModel");

const ClothingItem = require('../controllers/clothingItem');
const { RomanticOutfitStrategy, AthleisureOutfitStrategy, PreppyOutfitStrategy, TomboyOutfitStrategy } = require('../strategies/outfit');


class OutfitGeneratorFactory {
    static async createOutfitGenerator(userId, options) {
        // Determine the strategies based on the clothing items
        let strategies = [];

        // Get the user's clothing items
        const clothingItems = await ClothingItem.getAllClothingItems(userId);

        // Check for Romantic strategy
        console.log('checking for romantic strategy')
        if (clothingItems.some(item => (item.subcategory === 'Skirt' || item.subcategory === 'Dress') && item.color.some(color => ['Blue', 'Red', 'Yellow', 'Green'].includes(color)) && options.style != 'Sportswear')) {
            strategies.push(new RomanticOutfitStrategy(userId, options));
        }

        // Check for Athleisure strategy
        if (clothingItems.some(item => item.category === 'Bottom' && item.style === 'Sportswear' && (options.style == 'Casual') || (options.style == 'Sportswear'))) {
            strategies.push(new AthleisureOutfitStrategy(userId, options));
        }

        // Check for Preppy strategy
        console.log('checking for preppy strategy')
        if (clothingItems.some(item => ['Pants', 'Blouse', 'Jacket', 'Coat'].includes(item.subcategory) && ['Formal', 'Evening'].includes(item.style))) {   
            console.log('preppy strategy secildi')
            console.log('preppy strategy secildi')
            strategies.push(new PreppyOutfitStrategy(userId, options));
        }

        // Check for Tomboy strategy
        if (clothingItems.some(item => 
            ['Jeans', 'Pants', 'Shorts'].includes(item.subcategory) 
            && item.details 
            && item.details.fit_type === 'Oversize'
            && (item.category !== 'Top' ? item.style === 'Casual' : ['Casual', 'Sportswear'].includes(item.style))
        )) {
            strategies.push(new TomboyOutfitStrategy(userId, options));
        }

        console.log('strategies that are available to select:', strategies);

        // If no strategies were selected, throw an error
        if (strategies.length === 0) {
            throw new Error('No strategies could be selected based on the provided clothing items');
        }

         // Get the strategies that the user has saved
        const savedStrategies = await Outfit.find({ isSaved: true }).distinct('strategy');
        console.log('saved strategies:', savedStrategies);

        // Intersect the available strategies with the saved strategies
        const strategyNameMapping = {
            'RomanticOutfitStrategy': 'romantic',
            'AthleisureOutfitStrategy': 'athleisure',
            'PreppyOutfitStrategy': 'preppy',
            'TomboyOutfitStrategy': 'tomboy'
        };
        const commonStrategies = strategies.filter(strategy => savedStrategies.includes(strategyNameMapping[strategy.constructor.name]));
        console.log('common strategies:', commonStrategies);

        let selectedStrategies = [];

        // If there are common strategies, ensure at least one of them is selected
        if (commonStrategies.length > 0) {
            let savedStrategy = commonStrategies[Math.floor(Math.random() * commonStrategies.length)];
            selectedStrategies.push(savedStrategy);

            // Select the rest of the strategies randomly from the remaining strategies
            let remainingStrategies = strategies.filter(strategy => strategyNameMapping[strategy.constructor.name] !== strategyNameMapping[savedStrategy.constructor.name]);
            console.log('remaining strategies:', remainingStrategies);
            while (selectedStrategies.length < 2 && remainingStrategies.length > 0) {
                let randomIndex = Math.floor(Math.random() * remainingStrategies.length);
                selectedStrategies.push(remainingStrategies[randomIndex]);
                remainingStrategies.splice(randomIndex, 1);
            }
        } else {
            // If there are no common strategies or no saved strategies, select from the available strategies
            while (selectedStrategies.length < 2 && strategies.length > 0) {
                let randomIndex = Math.floor(Math.random() * strategies.length);
                selectedStrategies.push(strategies[randomIndex]);
                strategies.splice(randomIndex, 1);
            }
        }

        console.log('selected strategies:', selectedStrategies);

        // Create a new OutfitGenerator with the chosen strategies
        return new OutfitGenerator(selectedStrategies);
    }
}

module.exports = OutfitGeneratorFactory;