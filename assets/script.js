const API_KEY = 'b9d7e8ce9dc6dbbedf5c0bdbc338f4f9'; // OpenWeatherMap API key

const searchBtn = document.getElementById('search');
const cityInput = document.getElementById('city');
const weatherDataDiv = document.getElementById('weather-data');
const forecastDiv = document.getElementById('forecast');
const cityList = document.getElementById('city-list'); // Reference to the city list

searchBtn.addEventListener('click', getWeather);

function getWeather() {
    const city = cityInput.value.trim();

    if (city) {
        // Fetch current weather data
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`)
            .then(response => response.json())
            .then(data => {
                if (data.cod === '404') {
                    weatherDataDiv.innerHTML = '<p>City not found. Please try again.</p>';
                    forecastDiv.innerHTML = ''; // Clear forecast data if city not found
                } else {
                    displayCurrentWeather(data); // Display current weather data
                    updateCityList(city); // Add the searched city to the list
                   
                    // Fetch 5-day forecast data
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`)
                        .then(response => response.json())
                        .then(forecastData => {
                            displayForecast(forecastData); // Display 5-day forecast data
                        })
                        .catch(error => {
                            console.error('Error fetching forecast data:', error);
                            forecastDiv.innerHTML = '<p>Error fetching forecast data. Please try again.</p>';
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherDataDiv.innerHTML = '<p>Error fetching weather data. Please try again.</p>';
                forecastDiv.innerHTML = ''; // Clear forecast data on weather data fetch error
            });
    } else {
        weatherDataDiv.innerHTML = '<p>Please enter a city.</p>';
        forecastDiv.innerHTML = ''; // Clear forecast data if no city entered
    }
}

function displayCurrentWeather(data) {
    // Display current weather data
    weatherDataDiv.innerHTML = `
        <h2>${data.name} Weather</h2>
        <p>Temp: ${data.main.temp}°F</p>
        <p>Wind: ${data.wind.speed} MPH</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
}

function displayForecast(forecastData) {
    // Display 5-day forecast data
    const forecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00:00')); // Extracts daily forecasts (at noon)
    forecastDiv.innerHTML = '<h3>5-Day Forecast</h3>';
    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000); // Convert UNIX timestamp to date
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = forecast.main.temp;
        forecastDiv.innerHTML += `
            <div>
                <p>${day}</p>
                <p>Temp: ${temp}°F</p>
            </div>
        `;
    });
}

const MAX_SEARCH_HISTORY = 5; // Maximum number of search history items to display

// Update the updateCityList function to limit the number of displayed items
function updateCityList(city) {
    const cityButtons = document.querySelectorAll('.city-button');
    
    // If there are already 5 search history items, remove the oldest one before adding the new one
    if (cityButtons.length >= MAX_SEARCH_HISTORY) {
        cityList.removeChild(cityList.firstElementChild); // Remove the oldest city button
    }

    const button = document.createElement('button');
    button.textContent = city;
    button.classList.add('city-button'); // Add a class for styling or event handling
    cityList.appendChild(button);

    // Add a click event listener to each city button
    button.addEventListener('click', function() {
        cityInput.value = city; // Set the input field value to the clicked city
        getWeather(); // Trigger weather search for the clicked city
    });
}
