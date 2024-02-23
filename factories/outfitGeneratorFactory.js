const OutfitGenerator = require('../generators/outfitGenerator');
const ThreeColorStrategy = require('../strategies/outfit/threeColorStrategy');

class OutfitGeneratorFactory {
    static createOutfitGenerator(userId, options) {
        switch (options.type) {
            case 'threeColor':
                return new OutfitGenerator(new ThreeColorStrategy(userId, options));
            default:
                throw new Error(`Invalid type: ${type}`);
        }
    }
}

module.exports = OutfitGeneratorFactory;