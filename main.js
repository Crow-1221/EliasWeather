// Select My Elements
let search = document.querySelector("#search");
let submit = document.querySelector("#submit");
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
    path: '/Global.json'
})

// Get Location (Default)
navigator.geolocation.getCurrentPosition(
    (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        lat_lon = `lat=${lat}&lon=${lon}`
        getWeather()
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
let xhr, data;
function getWeather() {
    // AJAX Main
    xhr = new XMLHttpRequest;
    // Request Preparing
    xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?${lat_lon ? lat_lon : ("q=" + currCity)}&appid=5018f7cbbcf273011370716657d05e17&units=metric`)
    // Request Monitoring
    xhr.onloadend = function () {
        if (this.status === 200) {
            data = JSON.parse(this.responseText);
            city.innerHTML = `${data.name} .${data.sys.country}`;
            temp.innerHTML = Math.round(data.main.temp);
            description.innerHTML = data.weather[0].main;
            // cont_city = transformCoords(lat, lon);
            chooseIcon();
            setBackground();
            getLatLon(currCity);
        }
        // Alert If City Not Found
        else if (this.status === 404) {
            let alert = document.querySelector("#alert");
            alert.innerHTML = `${currCity} Not Found`;
            alert.style.display = "block";
            alert.addEventListener("click", () => {
                alert.style.display = "none";
            });
            setTimeout(() => {
                alert.style.display = "none";
            }, 5000);
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
    }
    else {
        (document.getElementById("background")).className = "night";
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

    if (condition === "Clear") {

        // Check Country Time
        if (current >= sunrise && current < sunset) {
            iconPath = "/Weather-sunny.json"
        }
        else {
            iconPath = "/Clear Night Moon.json"
        }
    }
    else if (condition === "Clouds") {

        iconPath = "/Weather-mist.json"
    }
    else if (condition === "Rain") {
        iconPath = "/rainy icon.json";
    }
    else if (condition === "Snow") {
        iconPath = "/Weather-snow.json"
    }
    else {
        // Check Country Time
        // if (current >= sunrise && current < sunset) {
        //     iconPath = "/Weather-sunny.json"
        // }
        // else {
        //     iconPath = "/Clear Night Moon.json"
        // }
        iconPath = "/Weather-mist.json"
    }
    lottie.loadAnimation({
        container: document.getElementById("weather-icon"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: iconPath
    });
}



async function getLatLon(city) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
    );
    const data = await res.json();

    function transformCoords(lat, lng) {

        const { DateTime } = luxon;
        const now = DateTime.now()
            .setZone(tzlookup(lat, lng))
            .toFormat("dd LLL, HH:mm");
        document.getElementById("date-time").innerText = now;

    }
    transformCoords(data[0].lat, data[0].lon)
}

