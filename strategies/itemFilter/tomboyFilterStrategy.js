const ClothingItem = require('../../controllers/clothingItem');
const weather = require('../../controllers/weather');
const baseFilterStrategy = require('./baseFilterStrategy');

/// ALT VE ÜST BOL PARÇALAR OLACAL OVERSİZE
// casual sportswear karışık olabilir
// alt parça jean olsun şort vs de olabilr
// ayakkabılar casual spor olabilir
// outerwear casual spowrtswear olabilir

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
            if (item.wearableWeather !== dayWeather || item.details.fit_type !== 'Oversize') {
                return false;
            }
        
            switch (item.category) {
                case 'Top':
                    return item.style === 'Casual';
                case 'Bottom':
                    return ['Jeans', 'Pants', 'Shorts'].includes(item.subCategory);
                case 'Outerwear':
                    return item.style === 'Casual' || item.style === 'Formal';
                default:
                    return false;
            }
        });
        return filteredItems;
    }
}   
module.exports = tomboyFilterStrategy;