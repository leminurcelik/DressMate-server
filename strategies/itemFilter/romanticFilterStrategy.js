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

        const desiredColors = ['Red', 'Blue', 'White', 'Yellow', 'Green'];
        // filter 
        const filteredItems = clothingItems.filter(item => {
            return item.wearableWeather === dayWeather 
                && (item.style === 'Casual' || item.style === 'Formal' || item.style === 'Evening')
                && (item.category === 'Top' || item.subcategory === 'Skirt' || item.category === 'Shoes' || item.category === 'One-piece' || item.category === 'Outerwear')
                && item.color.some(color => desiredColors.includes(color));
        });

        return filteredItems;
    }
}
module.exports = romanticFilterStrategy;