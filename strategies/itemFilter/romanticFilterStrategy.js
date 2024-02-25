const ClothingItem = require('../../controllers/clothingItem');
const weather = require('../../controllers/weather');
const baseFilterStrategy = require('./baseFilterStrategy');

class romanticFilterStrategy extends baseFilterStrategy{
    async filterItems(userId, options){
        console.log('came to romanticFilterStrategy');
        console.log('options:', options);
        
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
        console.log('dayWeather:', dayWeather);

        // filter the clothing items by the weather and style
        const filteredItems = clothingItems.filter(item => {
            return item.wearableWeather === dayWeather
        });
        return filteredItems;
    }
}
module.exports = romanticFilterStrategy;