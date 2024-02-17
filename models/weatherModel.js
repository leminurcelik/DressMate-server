/*WeatherForecast Model: //eğer hava durumunu ayrıca barındırmayacaksak bu ayrı olmayabilir
    * Attributes:
    * forecastId: Unique identifier for each weather forecast.
    * date: Date for which the forecast is applicable.
    * location: User's specified location for the forecast.
    * temperature: Predicted temperature for the specified date.
    * weatherCondition: Description of the weather conditions.
 */
const mongoose = require("mongoose");
const weatherForecastSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    weatherCondition: {
        type: String,
        required: true,
    },
});