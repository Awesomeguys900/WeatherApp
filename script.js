key = "3fc34f5f8b274a02bd3932e93c860547";

function updateDateTime() {
  var now = new Date();
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var day = days[now.getDay()];
  var month = months[now.getMonth()];
  var date = now.getDate();
  var year = now.getFullYear();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime =
    day +
    " " +
    date +
    " " +
    month +
    " " +
    year +
    " | " +
    hours +
    ":" +
    minutes +
    " " +
    ampm;
  return strTime;
}

function windBreeze(windSpeed) {
  var windDescription = "";
  if (windSpeed < 1) {
    windDescription = "Calm";
  } else if (windSpeed < 4) {
    windDescription = "Light breeze";
  } else if (windSpeed < 7) {
    windDescription = "Moderate breeze";
  } else if (windSpeed < 11) {
    windDescription = "Fresh breeze";
  } else if (windSpeed < 16) {
    windDescription = "Strong breeze";
  } else if (windSpeed < 22) {
    windDescription = "High wind";
  } else {
    windDescription = "Hurricane force";
  }
  return windDescription;
}

function updateWebsite(responseData) {
  console.log(responseData);

  //Update City Name/Time
  document.getElementsByClassName("cityCountry")[0].innerHTML =
    responseData["name"] + ", " + responseData["sys"]["country"];
  console.log("hello");
  document.getElementsByClassName("date")[0].innerHTML = updateDateTime();

  // Basic Weather Update
  document.getElementsByClassName("temperature")[0].innerHTML =
    responseData["main"]["temp"] + "°C"; //make C switch based on units
  document.getElementsByClassName("weatherDescription")[0].innerHTML =
    responseData["weather"][0]["description"];

  var windSpeed = responseData["wind"]["speed"];

  document.getElementsByClassName("extraInfo")[0].innerHTML =
    "Feels like: " +
    responseData["main"]["feels_like"] +
    "°C\n" +
    windBreeze(windSpeed);

  //TODO Change Icon based on weather

  // 3 by 3 row
  document.getElementById("windSpeed").textContent =
    responseData.wind.speed + " m/s";

  document.getElementById("humidity").textContent =
    responseData.main.humidity + "%";

  document.getElementById("visibility").textContent =
    responseData.visibility / 1000 + "km";

  document.getElementById("cloudiness").textContent =
    responseData.clouds.all + "%";

  let sunriseDate = new Date(responseData.sys.sunrise * 1000);
  let sunsetDate = new Date(responseData.sys.sunset * 1000);
  document.getElementById("sunrise").textContent =
    sunriseDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  document.getElementById("sunset").textContent = sunsetDate.toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  );
}

async function weatherQueryData(lat, lon, units) {
  try {
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        key +
        "&units=" +
        units
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {}
}

async function weatherQuery(units) {
  var searchValue = document.getElementById("search").value.trim();

  if (searchValue === "") {
    console.log("The search field is empty.");
  } else if (searchValue.length > 0) {
    try {
      const location = await locationFinder(searchValue);
      if (location) {
        const responseData = await weatherQueryData(
          location.lat,
          location.lon,
          units
        );
        updateWebsite(responseData);
      } else {
        console.log("No location found");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

async function locationFinder(searchValue) {
  try {
    const response = await fetch(
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
        searchValue +
        "&limit=5&appid=" +
        key
    );
    const responseData = await response.json();

    if (responseData.length === 0) {
      console.log("No location found");
      return;
    }

    var lat = responseData[0]["lat"];
    var lon = responseData[0]["lon"];
    return { lat, lon };
  } catch (error) {
    console.log("error finding location");
    throw error;
  }
}

document.getElementById("searchButton").addEventListener("click", function () {
  weatherQuery("metric"); //TODO change units based on user preference
});
