const ClothingItem = require('../../controllers/clothingItem');
const weather = require('../../controllers/weather');
const baseFilterStrategy = require('./baseFilterStrategy');

class tomboyFilterStrategy extends baseFilterStrategy{
    async filterItems(userId, options){
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
            return item.wearableWeather === dayWeather &&
                   item.style === options.style
        });
        return filteredItems;
    }
}   
module.exports = tomboyFilterStrategy;