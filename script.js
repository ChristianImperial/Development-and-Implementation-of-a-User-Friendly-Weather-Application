$(document).ready(function() {
  
  /* EVENT LISTENERS */
  document.getElementById("btnNxtForecast").addEventListener('click', displayNextDaysForecast); // add listener for the button pressed
  //document.getElementById('tMetric').addEventListener('click', toggleUnits);
  //document.getElementById('tImperial').addEventListener('click', toggleUnits);

  /** VARIABLES AND REFERENCES **/
  var timer = ""; // reference variable for the timeout object
  var backdropTimer = ""; // backdrop timer (interval) variable reference
  var clockDisplay = $('#clockDisplay'); // reference variable for the clock display
  var dateDisplay = $('#dateDisplay'); // date display
  var body = $('body'); // reference variable for the page body, used in setting the right backdrop
  var backdrops = { 
    dawn: 'backdrop-dawn', 
    morning: 'backdrop-morning', 
    mid: 'backdrop-midday', 
    dusk: 'backdrop-dusk', 
    night: 'backdrop-night'
  }; // backdrop class list
  var months = { 
    0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 
    4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 
    8: 'Sept', 9: 'Oct', 10: 'Nov', 11: 'Dec'
  }; // list of months in a year
  
  initAll(); // initialize all necessary functions

  /*
  * Initialization
  * start clock
  */
  function initAll() {
    resetClockTimer(); // reset timeout object if any
    startClock(); // start a new timeout and get the current time
  }
  
  /* GET THE CURRENT TIME */
  function startClock() {
    timer = setTimeout(updateClockDisplay, 500); // start clock
    setBackdrop(); // set backdrop on page load
    backdropTimer = setTimeout(setBackdrop, 360000); // set interval to check for the right backdrop every hour
  }
  
  /*
  * Reset timer and clear the interval by its ID
  */
  function resetClockTimer() {
    updateClockDisplay(); // make sure the current time is displayed when page loads
    
    if (timer !== "") {
      clearTimeout(backdropTimer);
      clearTimeout(timer);
      timer = "";
    }
  }
  
  /*
  * Get the current time by Date object
  */
  function getTime() {
    const time = new Date();
    const hh = time.getHours();
    const mm = time.getMinutes();
    
    displayCurrentDate(time); // update current date display
    
    return (hh < 10 ? '0' + hh : hh) + ':' + (mm < 10 ? '0' + mm : mm);
  }
  
  /*
  * Get current date and update display
  * format: MM, dd YYYY
  */
  function displayCurrentDate(date) {
    dateDisplay.text(months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear());
  }
  
  /*
  * Update clock display
  */
  function updateClockDisplay() {
    clockDisplay.text(getTime());
    timer = setTimeout(updateClockDisplay, 500); // set another timeout to update the clock display
  }
  
  /*
  * Set backdrop class according to the time 
  */
  function setBackdrop() {
    clearTimeout(backdropTimer);   
    removeBackdrop(); // remove the backdrop class if set already before updating
    
    const hh = new Date().getHours(); // Get the current hour

    if (hh >= 5 && hh <= 6) {     
      body.addClass(backdrops['dawn']);
    } else if (hh > 6 && hh <= 10) {
      body.addClass(backdrops['morning']);  
    } else if (hh > 10 && hh < 16) {
      body.addClass(backdrops['mid']);
    } else if (hh >= 16 && hh <= 18) {
      body.addClass(backdrops['dusk']);
    } else {
      body.addClass(backdrops['night']);
    }
    
    backdropTimer = setTimeout(setBackdrop, 360000);
  }
  
  /*
  * Remove backdrop class if found in the body
  */
  function removeBackdrop() {
    /* Remove any backdrop class found in the body */
    body.removeClass(function(index, css) {
      return (css.match(/((backdrop)(-\w+))/g) || []).join('');
    });
  }
  
  /** Next Days Forecast **/
  function displayNextDaysForecast() {
    // Implementation to show the next days forecast will go here
  }
  
  /*
  * Toggle between metric and imperial units
  */
  function toggleUnits(e) {
    // Implementation to toggle units will go here
  }
});


// Function to fetch weather data by city name
async function fetchWeatherData(city) {
  const apiKey = 'b5f558462160da78810acd0bb997a9fd';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    updateWeatherDisplay(data);
  } catch (error) {
    console.error(error);
    alert(error.message); // Show error message
  }
}

// Function to fetch weather data by coordinates (latitude & longitude)
async function fetchWeatherByCoordinates(lat, lon) {
  const apiKey = 'b5f558462160da78810acd0bb997a9fd';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Location weather data not available');
    }
    const data = await response.json();
    updateWeatherDisplay(data);
  } catch (error) {
    console.error(error);
    alert(error.message); // Show error message
  }
}

// Function to update the HTML with weather data
function updateWeatherDisplay(data) {
  const city = data.name; // City name
  const temp = data.main.temp; // Temperature
  const feel = data.main.feels_like; // Real feel
  const humidity = data.main.humidity; // Humidity
  const wind = data.wind.speed; // Wind speed

  // Update HTML elements
  document.getElementById('curLocationDisplay').innerText = city;
  document.getElementById('tempDisplay').innerText = `${temp} °C`;
  document.getElementById('feelDisplay').innerText = `${feel} °C`;
  document.getElementById('humidDisplay').innerText = `${humidity}%`;
  document.getElementById('windDisplay').innerText = `${wind} m/s`;
}

// Function to handle the search button click
function searchWeather() {
  const city = document.getElementById('searchInput').value.trim(); // Get user input
  if (city) {
    fetchWeatherData(city); // Fetch weather data for the input city
  } else {
    alert('Please enter a valid city or country'); // Show error if input is empty
  }
}

// Optional: Trigger search on "Enter" key press
document.getElementById('searchInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchWeather(); // Trigger search when Enter key is pressed
    e.preventDefault(); // Prevent form submission
  }
});

// Function to get user location using the browser's Geolocation API
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

// Success callback when location is fetched
function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  fetchWeatherByCoordinates(latitude, longitude); // Fetch weather using the coordinates
}

// Error callback if location access is denied or fails
function error() {
  alert('Unable to retrieve your location. Please search for a city instead.');
}

// Call getUserLocation on page load
window.onload = function () {
  getUserLocation(); // Try to get the user's location when the page loads
};

