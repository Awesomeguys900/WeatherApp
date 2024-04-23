key = "3fc34f5f8b274a02bd3932e93c860547";

function updateWebsite(responseData) {
  console.log(responseData);
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
