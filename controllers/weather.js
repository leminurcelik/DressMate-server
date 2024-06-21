/* get weather at specified location, time */
// Compare server/controllers/weather.js:
// /*


//const fetch = require("node-fetch");


//function that gets lat and lon
/**example output of API request
 * [
    {
        "name": "Reşitpaşa Mahallesi",
        "local_names": {
            "tr": "Reşitpaşa Mahallesi"
        },
        "lat": 41.1068809,
        "lon": 29.0411147,
        "country": "TR"
    }
]
 */
const axios = require('axios');
import { openWeatherApiKey } from '../config/config';   

const locationInfo = (location) => {

    const url = `http://api.openweathermap.org/geo/1.0/direct?appid=${openWeatherApiKey}&q=${location}`;
    return axios.get(url)
        .then(response => {
            const data = response.data;
            if (data.length > 0) {
                const { lat, lon } = data[0];
                //console.log({lat,lon});
                return { lat, lon };
            } else {
                return { lat: null, lon: null };
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return { lat: null, lon: null };
        });
}

// date tarih, time gün içindeki vakti belirtiyor
const getTemperature = (location,date, time) => {
    

    if (time == "Morning") { //09:00
        dateTime = date + " " + "09:00:00";
        
    }
    else if (time == "Afternoon") {//15:00
        dateTime = date + " " + "15:00:00";
    }
    //means evening
    else{ //21:00
        dateTime = date + " " + "21:00:00";
    }
    console.log("datetime in weather",dateTime);
    // getting lat lon from locationInfo
    return locationInfo(location)
        .then(locationData => {
            // Use lat and lon obtained from locationInfo function
            const lat = locationData.lat;
            const lon = locationData.lon;
        

            //sending request for weather forecast 
            //url
            // api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric

            // Constructing the absolute URL
            const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
            console.log(axios.get(url));

            return axios.get(url)
            .then(response => {
                const data = response.data;
                // Process the weather data here
                // For example, find the temperature for the specified dateTime
                const forecast = data.list.find(entry => entry.dt_txt === dateTime);
                
                //console.log("Forecast:", forecast);
                if (forecast) {
                    return {
                        /**
                         * For code 500 - light rain icon = "10d". See below a full list of codes 
                         * URL is https://openweathermap.org/img/wn/10d@2x.png
                         */
                        temperature: forecast.main.temp,
                        condition: forecast.weather[0].main,
                        //icon: forecast.weather[0].icon,
                        iconUrl: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`
                    };
                } else {
                    console.log("forecast not found");
                    return null; // or handle the case when the date and time are not found
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                return null;
            });
        })
        .catch(error => {
            console.error('Error: happened at calling locationInfo from weatherInfo', error);
        });

}


function getNextFiveDates() {
    let dates = [];

    for (let i = 0; i < 5; i++) {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i); // Add i days to the current date

        const year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
        let day = currentDate.getDate();

        // Add leading zero if month is less than 10
        if (month < 10) {
            month = "0" + month;
        }

        // Add leading zero if day is less than 10
        if (day < 10) {
            day = "0" + day;
        }

        let dateTime = year + "-" + month + "-" + day;
        dates.push(dateTime);
    }

    return dates;
}

module.exports = {locationInfo, getTemperature, getNextFiveDates};
