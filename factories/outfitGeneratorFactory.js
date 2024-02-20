const OutfitGenerator = require('../generators/outfitGenerator');
const ThreeColorStrategy = require('../strategies/threeColorStrategy');

class OutfitGeneratorFactory {
    static createOutfitGenerator(userId, options) {
        //console.log("outfit generator factory");
        //console.log(options);
        //console.log(userId);
        //console.log("outfit generator factory end")
        switch (options.type) {
            case 'threeColor':
                return new OutfitGenerator(new ThreeColorStrategy(userId, options));
            default:
                throw new Error(`Invalid type: ${type}`);
        }
    }
}

module.exports = OutfitGeneratorFactory;