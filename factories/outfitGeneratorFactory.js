const OutfitGenerator = require('../generators/outfitGenerator');

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
        if (clothingItems.some(item => (item.subcategory === 'Skirt' || item.subcategory === 'Dress') && item.color.some(color => ['Blue', 'Red', 'Yellow', 'Green'].includes(color)))) {
            strategies.push(new RomanticOutfitStrategy(userId, options));
        }

        // Check for Athleisure strategy
        if (clothingItems.some(item => item.category === 'Bottom' && item.style === 'Sportswear')) {
            strategies.push(new AthleisureOutfitStrategy(userId, options));
        }

        // Check for Preppy strategy
        if (clothingItems.some(item => ['Pants', 'Blouse', 'Jacket', 'Coat'].includes(item.subcategory) && ['Formal', 'Evening'].includes(item.style))) {
            strategies.push(new PreppyOutfitStrategy(userId, options));
        }

        // Check for Tomboy strategy
        if (clothingItems.some(item => item.subcategory === 'Jeans' && item.details && item.details.fit_type === 'Oversize')) {
            strategies.push(new TomboyOutfitStrategy(userId, options));
        }

        // If no strategies were selected, throw an error
        if (strategies.length === 0) {
            throw new Error('No strategies could be selected based on the provided clothing items');
        }

        //userın seçtiklerini dikkate alınca bu randomluk kalkacak
        // Select two random strategies
        // Select two random strategies
        console.log('strategies:', strategies);
        let selectedStrategies = [];
        if (strategies.length === 1) {
            selectedStrategies = strategies;
        } else {
            let randomIndices = [];
            while (randomIndices.length < 2) {
                let randomIndex = Math.floor(Math.random() * strategies.length);
                if (!randomIndices.includes(randomIndex)) {
                    randomIndices.push(randomIndex);
                }
            }
            selectedStrategies = randomIndices.map(index => strategies[index]);
        }
        console.log('selectedStrategies:', selectedStrategies);

        // Create a new OutfitGenerator with the chosen strategies
        return new OutfitGenerator(selectedStrategies);
    }
}

module.exports = OutfitGeneratorFactory;