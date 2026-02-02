// Select My Elements
let search = document.querySelector("#search");
let submit = document.querySelector("#submit");
let textAlert = document.querySelector("#alert");
let city = document.querySelector("#city");
let temp = document.querySelector("#weather-temp");
let description = document.querySelector("#weather-description");

let currCity = "Rabat";
let lat, lon, lat_lon;
// "Continent/City"
let cont_city;
// Body Background
lottie.loadAnimation({
    container: document.getElementById("background"),
    renderer: "svg",
    autoplay: true,
    loop: true,
    path: 'https://raw.githubusercontent.com/Crow-1221/EliasWeather/main/Global.json'
})

// Get Location (Default)
navigator.geolocation.getCurrentPosition(
    (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        lat_lon = `lat=${lat}&lon=${lon}`
    }
)
// Search City Weather
search.addEventListener("keydown", (key) => {
    if (key.key === "Enter") {
        lat_lon = undefined
        currCity = search.value;
        search.value = "";
        getWeather();
    }
})
// Or
submit.addEventListener("click", () => {
    lat_lon = undefined
    currCity = search.value;
    search.value = "";
    getWeather();
})
// Get Weather Function
let keyAPI = "5018f7cbbcf273011370716657d05e17";
let xhr, data;
function getWeather() {
    // AJAX Main
    xhr = new XMLHttpRequest;
    // Request Preparing
    xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?${lat_lon ? lat_lon : ("q=" + currCity)}&appid=${keyAPI}&units=metric`)
    // Request Monitoring
    xhr.onloadend = function () {
        if (this.status === 200) {
            data = JSON.parse(this.responseText);
            city.innerHTML = `${data.name} .${data.sys.country}`;
            temp.innerHTML = Math.round(data.main.temp) + "°";
            description.innerHTML = data.weather[0].main;
            // cont_city = transformCoords(lat, lon);
            chooseIcon();
            setBackground();
            getLatLon(currCity);
            setTimeout(() => {
                getForecastNextDays()
            }, 2000);



            console.log(data.coord)
        }
        // Alert If City Not Found
        else if (this.status === 404) {
            textAlert.innerHTML = `${currCity} Not Found`;
            textAlert.style.display = "block";
            textAlert.addEventListener("click", () => {
                atextAlertlert.style.display = "none";
            });
            setTimeout(() => {
                textAlert.style.display = "none";
            }, 5000);
            currCity = "";
        };
    }
    // Send Request
    xhr.send()
}

// First Call Of Function(Main Call)
setTimeout(() => {
    getWeather()
}, 2000)
// Set Time For Update The Weather Auto
setInterval(getWeather, 300000)



// Set Background Depends About (morning/night)
function setBackground() {
    data = JSON.parse(xhr.responseText);
    // Country Time
    const current = data.dt + data.timezone;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;

    if (current >= sunrise && current < sunset) {
        (document.getElementById("background")).className = "morning";
        if (window.innerWidth <= 568) {
            textAlert.style.cssText = "color: #ffffff;"
        }
        else {
            textAlert.style.cssText = "background-color: #9eb3ff";
        }

        window.addEventListener("resize", () => {
            if (window.innerWidth <= 568) {
                textAlert.style.cssText = "color: #ffffff;"
            }
            else {
                textAlert.style.cssText = "color: #ffffff; text-shadow: none; background-color: #9eb3ff;"
            }

        })
    }
    else {
        (document.getElementById("background")).className = "night";
        if (window.innerWidth <= 568) {
            textAlert.style.cssText = "color: #989898db; text-shadow: 1px 1px 1px #ffffff;";
        }
        else {
            textAlert.style.cssText = "background-color: #a1a1a2";
        }

        window.addEventListener("resize", () => {
            if (window.innerWidth <= 568) {
                textAlert.style.cssText = "color: #989898db; text-shadow: 1px 1px 1px #ffffff;"
            }
            else {
                textAlert.style.cssText = "color: #ffffff; text-shadow: none; background-color: #a1a1a2;"
            }
        })
    }
}



// Choose The Icon
function chooseIcon() {
    // Remove Old Icon
    let oldIcon = document.querySelector("#weather-icon");
    oldIcon.remove();
    // Create New Icon
    let newIcon = document.createElement("i");
    newIcon.id = "weather-icon";
    let temp_icon = document.querySelector(".weather-info");
    temp_icon.prepend(newIcon);
    // Icon Path
    let iconPath;
    // Weather Condition
    data = JSON.parse(xhr.responseText);
    let condition = data.weather[0].main;
    // Country Time
    const current = data.dt + data.timezone;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;



    switch (condition) {
        case "Clear":
            // Check Country Time
            if (current >= sunrise && current < sunset) {
                iconPath = "https://raw.githubusercontent.com/Crow-1221/EliasWeather/main/Weather-sunny.json"
            }
            else {
                iconPath = "https://raw.githubusercontent.com/Crow-1221/EliasWeather/main/Moon.json"
            }
            break;
        case "Clouds":
            iconPath = "https://raw.githubusercontent.com/Crow-1221/EliasWeather/main/Weather-mist.json"
            break;
        case "Rain":
            iconPath = "https://raw.githubusercontent.com/Crow-1221/EliasWeather/main/rainy icon.json";
            break;
        case "Snow":
            iconPath = "https://raw.githubusercontent.com/Crow-1221/EliasWeather/main/Weather-snow.json"
            break;
        default:
            iconPath = "https://raw.githubusercontent.com/Crow-1221/EliasWeather/main/Weather-mist.json"
    }
    lottie.loadAnimation({
        container: document.getElementById("weather-icon"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: iconPath
    });
}


// Get Lan, Lon For The City:
async function getLatLon(city) {
    const res = await fetch(
        // Request As Obj His Value It's Lan, Lon For The City:
        `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
    );
    // Transform It To Js Obj And Save it In Variable (data):
    const data = await res.json();

    // Timing Depends On Lat, Lon
    function transformCoords(lat, lng) {

        // Library For Get Time Depends On Lat, Lon:
        const { DateTime } = luxon;
        const now = DateTime.now()
            .setZone(tzlookup(lat, lng))
            .toFormat("dd LLL, HH:mm");
        document.getElementById("date-time").innerText = now;

    }
    transformCoords(data[0].lat, data[0].lon)
}

// Calling With Server And Get Forecast Next Days:
function getForecastNextDays() {
    // The Same AJAX, We Can Working By It Again:
    xhr.open("GET", `https://api.open-meteo.com/v1/forecast?latitude=${data.coord.lat}&longitude=${data.coord.lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
    xhr.onloadend = function () {
        if (this.status > 199 && this.status < 300) {
            let data = JSON.parse(this.responseText);
            let temperature_2m_min = data.daily.temperature_2m_min;
            let temperature_2m_max = data.daily.temperature_2m_max;
            let time = data.daily.time;

            // Clear First
            let forecastSection = document.querySelector(".forecast-next-days div");
            forecastSection.innerHTML = ""

            // Looping On The Forecasts And Set Values Them:
            for (let i = 0; i < temperature_2m_min.length; i++) {
                let forecastDay = document.createElement("div");

                // Transform From Normal Date (1999/01/21) To Day Name (Monday):
                let d = new Date(time[i]);
                let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                let dayName = days[d.getDay()];

                // Set Values:
                forecastDay.textContent = dayName;
                let forecast = document.createElement("span");
                forecast.innerHTML = Math.round(temperature_2m_min[i]) + "°" + "/" + Math.round(temperature_2m_max[i]) + "°";

                // Add Elements To DOM:
                forecastDay.append(forecast);
                forecastSection.append(forecastDay);
            }
            console.log(data)
        }
    }
    xhr.send()
}

