class OutfitGenerator {
    constructor(strategy) {
        this.strategy = strategy;
    }

    generateOutfit(userId, options) {
        return this.strategy.generateOutfit(userId, options);
    }
}

module.exports = OutfitGenerator;