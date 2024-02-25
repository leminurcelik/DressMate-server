const itemFilterGenerator = require('../generators/itemFilterGenerator');
const athleisureFilterStrategy = require('../strategies/itemFilter/athleisureFilterStrategy');
const tomboyFilterStrategy = require('../strategies/itemFilter/tomboyFilterStrategy');
const romanticFilterStrategy = require('../strategies/itemFilter/romanticFilterStrategy');
const preppyFilterStrategy = require('../strategies/itemFilter/preppyFilterStrategy');

class ItemFilterFactory {
    static ItemFilterFactory(userId, options, filter) {
        console.log('cam to itemFilterFactory   ', filter);
        switch (filter) {
            case 'athleisure':
                return new itemFilterGenerator(new athleisureFilterStrategy(userId, options));
            case 'tomboy':
                return new itemFilterGenerator(new tomboyFilterStrategy(userId, options));
            case 'romantic':
                return new itemFilterGenerator(new romanticFilterStrategy(userId, options));
            case 'preppy':
                return new itemFilterGenerator(new preppyFilterStrategy(userId, options));
            default:
                throw new Error(`Invalid type: ${type}`);
        }
    }
};

module.exports = ItemFilterFactory;