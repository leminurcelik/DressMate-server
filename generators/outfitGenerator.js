const OutfitGeneratorFactory = require('../factories/outfitGeneratorFactory');

class OutfitGenerator {
    constructor(userId, options) {
        this.userId = userId;
        this.options = options;
        this.strategies = [];
    }

    removeDuplicateOutfits(outfits) {
        let uniqueOutfits = [];
        let seenItems = new Set();
    
        for (let outfit of outfits) {
            // Get the first item from the outfit
            let item = outfit.items[0];
            // If the item is defined and hasn't been seen before, add it to the unique outfits
            if (item && item.id && !seenItems.has(item.id.toString())) {
                seenItems.add(item.id.toString());
                uniqueOutfits.push(outfit);
            }
        }
    
        return uniqueOutfits;
    }

    async generateOutfit() {
        // Get the strategies from the factory
        this.strategies = await OutfitGeneratorFactory.createStrategies(this.userId, this.options);
    
        // Create an array to hold the outfits generated by each strategy
        let outfits = [];
    
        // Use each strategy to generate an outfit
        for (let strategy of this.strategies) {
            try {
                let strategyOutfits = await strategy.generateOutfit(this.userId, this.options);
            // Add each outfit to the outfits array
            outfits.push(...strategyOutfits);
            } catch (error) {
                console.error(`Failed to generate outfit with strategy: ${strategy.constructor.name}`, error);
            }
        }
        outfits = this.removeDuplicateOutfits(outfits);
    
        // Return the array of outfits
        return outfits;
    }
}

module.exports = OutfitGenerator;