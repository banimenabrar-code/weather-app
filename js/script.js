let searchbtn = document.getElementById("search");
let searchvalue = document.querySelector(".search-bar");

searchbtn.addEventListener("click", async function () {

    let city = searchvalue.value.trim();

    if (city === "") {
        document.getElementById("msg").innerHTML = "Enter your city!";
        document.getElementById("msg").style.color = "red";
        return;
    }

    try {

        // 1. Find the city
        let cityResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
        );

        let cityData = await cityResponse.json();

        if (!cityData.results) {
            document.getElementById("msg").innerHTML =
                "Enter your city correctly!";
            document.getElementById("msg").style.color = "red";
            return;
        }

        // Get latitude and longitude
        let latitude = cityData.results[0].latitude;
        let longitude = cityData.results[0].longitude;
        let cityName = cityData.results[0].name;


        // 2. Get weather
        let weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m`
        );

        let weatherData = await weatherResponse.json();

        let weather = weatherData.current;


        // 3. Weather description
        let weatherDescription = getWeatherDescription(weather.weather_code);


        // 4. Update HTML
        document.querySelector(".city").innerHTML =
            "Weather in " + cityName;

        document.querySelector(".temp").innerHTML =
            weather.temperature_2m + "°C 🌡";

        document.querySelector(".description").innerHTML =
            weatherDescription;

        document.querySelector(".humidity").innerHTML =
            "Humidity is " + weather.relative_humidity_2m + "%";

        document.querySelector(".wind").innerHTML =
            "Wind speed " + weather.wind_speed_10m + " km/h";

        document.querySelector(".windDirection").innerHTML =
            "Wind direction " + weather.wind_direction_10m + "°";


        // Message
        document.getElementById("enterCity").style.display = "none";

        document.getElementById("msg").innerHTML =
            "Weather found 😊";

        document.getElementById("msg").style.color = "black";


    } catch (error) {

        console.log(error);

        document.getElementById("msg").innerHTML =
            "Something went wrong!";

        document.getElementById("msg").style.color = "red";
    }
});


// Convert weather code to text
function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky ☀️";
    }

    if (code === 1 || code === 2 || code === 3) {
        return "Cloudy ☁️";
    }

    if (code === 45 || code === 48) {
        return "Fog 🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "Rain 🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "Snow ❄️";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers 🌧️";
    }

    if (code >= 95) {
        return "Thunderstorm ⛈️";
    }

    return "Unknown weather";
}