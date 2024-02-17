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


const locationInfo = (location) => {
    const apiKey = "9d0eba47feca5e6f2c0b625262cce319";
    const url = `http://api.openweathermap.org/geo/1.0/direct?appid=${apiKey}&q=${location}`;

    return axios.get(url)
        .then(response => {
            const data = response.data;
            if (data.length > 0) {
                const { lat, lon } = data[0];
                console.log({lat,lon});
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

module.exports = {locationInfo};