const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeather API key

// Fetch weather details
async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return;

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    try {
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            document.getElementById('weatherInfo').innerHTML = `<p>City not found. Try again.</p>`;
            return;
        }

        const { lat, lon, name, country } = geoData[0];

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        document.getElementById('weatherInfo').innerHTML = `
            <h2>${name}, ${country}</h2>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="Weather Icon">
            <p>Temperature: ${weatherData.main.temp}°C</p>
            <p>Weather: ${weatherData.weather[0].description}</p>
            <p>Humidity: ${weatherData.main.humidity}%</p>
            <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
        `;
    } catch (error) {
        document.getElementById('weatherInfo').innerHTML = `<p>Error fetching data. Try again.</p>`;
        console.error("Error:", error);
    }
}

// Fetch city suggestions as user types
async function getCitySuggestions() {
    const input = document.getElementById('cityInput').value.trim();

    if (input.length < 2) {
        document.getElementById('suggestions').innerHTML = "";
        return;
    }

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        let suggestionsHTML = '';
        data.forEach(city => {
            suggestionsHTML += `<div onclick="selectCity('${city.name}, ${city.country}')">${city.name}, ${city.country}</div>`;
        });

        document.getElementById('suggestions').innerHTML = suggestionsHTML;
    } catch (error) {
        console.error("Error fetching city suggestions", error);
    }
}

// Select a city from suggestions
function selectCity(city) {
    document.getElementById('cityInput').value = city;
    document.getElementById('suggestions').innerHTML = "";
    getWeather();
}
