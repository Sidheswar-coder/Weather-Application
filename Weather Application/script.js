 // OpenWeatherMap API Key (Replace with your own)
 const API_KEY = 'c8506610238a658743b5bf1d09d2e31c';

 // DOM Elements
 const cityInput = document.getElementById('cityInput');
 const searchBtn = document.getElementById('searchBtn');
 const cityNameEl = document.getElementById('cityName');
 const currentTempEl = document.getElementById('currentTemp');
 const weatherDescriptionEl = document.getElementById('weatherDescription');
 const forecastContainer = document.getElementById('forecastContainer');

 // Weather Icons Mapping
 const weatherIcons = {
     'clear sky': 'fas fa-sun',
     'few clouds': 'fas fa-cloud-sun',
     'scattered clouds': 'fas fa-cloud',
     'broken clouds': 'fas fa-cloud',
     'shower rain': 'fas fa-cloud-rain',
     'rain': 'fas fa-cloud-showers-heavy',
     'thunderstorm': 'fas fa-bolt',
     'snow': 'fas fa-snowflake',
     'mist': 'fas fa-smog'
 };

 // Fetch Weather Data
 async function fetchWeatherData(city) {
     try {
         const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
         const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
         
         const currentData = await currentResponse.json();
         const forecastData = await forecastResponse.json();

         updateCurrentWeather(currentData);
         updateForecast(forecastData);
     } catch (error) {
         console.error('Error fetching weather data:', error);
         alert('Could not fetch weather data. Please try again.');
     }
 }

 // Update Current Weather
 function updateCurrentWeather(data) {
     const celsius = Math.round(data.main.temp);
     const fahrenheit = Math.round((celsius * 9/5) + 32);
     
     cityNameEl.textContent = data.name;
     currentTempEl.textContent = `${celsius}°C / ${fahrenheit}°F`;
     weatherDescriptionEl.textContent = data.weather[0].description;
 }

 // Update 5-Day Forecast
 function updateForecast(data) {
     forecastContainer.innerHTML = '';
     const dailyData = {};

     data.list.forEach(item => {
         const date = item.dt_txt.split(' ')[0];
         if (!dailyData[date]) {
             dailyData[date] = item;
         }
     });

     Object.values(dailyData).slice(0, 5).forEach(dayData => {
         const date = new Date(dayData.dt * 1000);
         const day = date.toLocaleDateString('en-US', { weekday: 'short' });
         const celsius = Math.round(dayData.main.temp);
         const fahrenheit = Math.round((celsius * 9/5) + 32);
         const description = dayData.weather[0].description;
         const icon = weatherIcons[description.toLowerCase()] || 'fas fa-cloud';

         const card = document.createElement('div');
         card.classList.add('forecast-card');
         card.innerHTML = `
             <h3>${day}</h3>
             <i class="weather-icon ${icon}"></i>
             <div class="temperature">${celsius}°C / ${fahrenheit}°F</div>
             <p class="description">${description}</p>
             <div class="details">
                 <div>
                     <i class="fas fa-wind"></i> ${dayData.wind.speed} m/s
                 </div>
                 <div>
                     <i class="fas fa-tint"></i> ${dayData.main.humidity}%
                 </div>
             </div>
         `;
         forecastContainer.appendChild(card);
     });
 }

 // Search Event Listener
 searchBtn.addEventListener('click', () => {
     const city = cityInput.value.trim();
     if (city) {
         fetchWeatherData(city);
     }
 });

 // Initial Load with Default City
 fetchWeatherData('Delhi');