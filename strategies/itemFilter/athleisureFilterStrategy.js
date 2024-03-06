const ClothingItem = require('../../controllers/clothingItem');
const weather = require('../../controllers/weather');
const baseFilterStrategy = require('./baseFilterStrategy');

///alt kısmı sportswear olacak
//üst casual, formal olabilir
//ayakkabılar spor ya da casual  olacak
//outerwear casual formal vs olacalk
// one piece olarak sadece sporstwear olan bir item olacak

class athleisureFilterStrategy extends baseFilterStrategy{
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
            if (item.wearableWeather !== dayWeather) {
                return false;
            }
        
            switch (item.category) {
                case 'One-piece':
                    return item.style === 'Sportswear' || item.style === 'Formal' || item.style === 'Evening';
                case 'Top':
                    return item.style === 'Casual' || item.style === 'Sportswear';
                case 'Bottom':
                    return item.style === 'Sportswear';
                case 'Shoes':
                    return item.style === 'Casual' || item.style === 'Sportswear';
                case 'Outerwear':
                    return item.style === 'Formal' || item.style === 'Casual';
                default:
                    return false;
            }
        });
        return filteredItems;
    }
}

module.exports = athleisureFilterStrategy;