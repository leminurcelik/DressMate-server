const ClothingItem = require('../../controllers/clothingItem');
const weather = require('../../controllers/weather');
const baseFilterStrategy = require('./baseFilterStrategy');

// formal casual evening parçalar olabilir
// etek elbise formal olacak şekilde olabilir
//üst blouse seçilsin 
//

class preppyFilterStrategy extends baseFilterStrategy{
    async filterItems(userId, options){
        console.log('preppyFilterStrategy geldi');
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
        // filter the clothing items by the weather and style
        const filteredItems = clothingItems.filter(item => {
            return item.wearableWeather === dayWeather && (item.style === 'Casual' || item.style === 'Formal');
        });
        return filteredItems;
    }
}
module.exports = preppyFilterStrategy;