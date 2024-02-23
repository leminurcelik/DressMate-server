class itemFilterGenerator {
    constructor(strategy) {
        this.strategy = strategy;
    }
    filterItems(userId, options) {
        return this.strategy.filterItems(userId, options);
    }
}

module.exports = itemFilterGenerator;