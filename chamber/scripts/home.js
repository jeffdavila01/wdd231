// ==========================================
// HOME PAGE
// Weather and Business Spotlights
// ==========================================


// ==========================================
// OPENWEATHERMAP SETTINGS
// ==========================================

// Replace this with your OpenWeatherMap API key.
const apiKey = "35eee68936c70b78ab87722058fbf04f";

// Coordinates for Navotas City
const latitude = 14.6667;
const longitude = 120.95;

const currentWeatherURL =
  `https://api.openweathermap.org/data/2.5/weather` +
  `?lat=${latitude}&lon=${longitude}` +
  `&units=metric&appid=${apiKey}`;

const forecastWeatherURL =
  `https://api.openweathermap.org/data/2.5/forecast` +
  `?lat=${latitude}&lon=${longitude}` +
  `&units=metric&appid=${apiKey}`;


// ==========================================
// CURRENT WEATHER
// ==========================================

const currentTemperature = document.querySelector(
  "#current-temperature"
);

const weatherDescription = document.querySelector(
  "#weather-description"
);

const weatherIcon = document.querySelector(
  "#weather-icon"
);

async function getCurrentWeather() {
  try {
    const response = await fetch(currentWeatherURL);

    if (!response.ok) {
      throw new Error(
        `Weather HTTP error: ${response.status}`
      );
    }

    const data = await response.json();

    displayCurrentWeather(data);
  } catch (error) {
    console.error(
      "Unable to load current weather:",
      error
    );

    currentTemperature.textContent = "--";

    weatherDescription.textContent =
      "Weather information is unavailable.";
  }
}

function displayCurrentWeather(data) {
  const temperature = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;

  currentTemperature.textContent = temperature;
  weatherDescription.textContent = description;

  weatherIcon.src =
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  weatherIcon.alt = description;
}


// ==========================================
// THREE-DAY FORECAST
// ==========================================

const forecastContainer = document.querySelector(
  "#forecast-container"
);

async function getWeatherForecast() {
  try {
    const response = await fetch(forecastWeatherURL);

    if (!response.ok) {
      throw new Error(
        `Forecast HTTP error: ${response.status}`
      );
    }

    const data = await response.json();

    displayForecast(
      data.list,
      data.city.timezone
    );
  } catch (error) {
    console.error(
      "Unable to load weather forecast:",
      error
    );

    forecastContainer.textContent =
      "Forecast information is unavailable.";
  }
}

function displayForecast(forecasts, timezoneOffset) {
  forecastContainer.innerHTML = "";

  /*
   * OpenWeatherMap provides a forecast every
   * three hours. This selects the forecast
   * closest to 12:00 PM local time.
   */
  const middayForecasts = forecasts.filter(
    (forecast) => {
      const localMilliseconds =
        (forecast.dt + timezoneOffset) * 1000;

      const localDate = new Date(
        localMilliseconds
      );

      return localDate.getUTCHours() === 12;
    }
  );

  const threeDayForecast =
    middayForecasts.slice(0, 3);

  threeDayForecast.forEach((forecast) => {
    const localMilliseconds =
      (forecast.dt + timezoneOffset) * 1000;

    const date = new Date(localMilliseconds);

    const dayName = new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "long",
        timeZone: "UTC"
      }
    ).format(date);

    const temperature = Math.round(
      forecast.main.temp
    );

    const forecastDay =
      document.createElement("div");

    const forecastName =
      document.createElement("strong");

    const forecastTemperature =
      document.createElement("span");

    forecastDay.classList.add("forecast-day");

    forecastName.textContent = dayName;

    forecastTemperature.innerHTML =
      `${temperature}&deg;C`;

    forecastDay.appendChild(forecastName);
    forecastDay.appendChild(forecastTemperature);

    forecastContainer.appendChild(forecastDay);
  });

  if (threeDayForecast.length === 0) {
    forecastContainer.textContent =
      "No forecast information was found.";
  }
}


// ==========================================
// BUSINESS SPOTLIGHTS
// ==========================================

const spotlightContainer = document.querySelector(
  "#spotlight-container"
);

const spotlightMembersURL =
  "./data/members.json";

const spotlightMembershipNames = {
  2: "Silver Member",
  3: "Gold Member"
};

async function getSpotlightMembers() {
  try {
    const response = await fetch(
      spotlightMembersURL
    );

    if (!response.ok) {
      throw new Error(
        `Members HTTP error: ${response.status}`
      );
    }

    const data = await response.json();

    /*
     * Your directory.js currently expects
     * members.json to be a direct array.
     *
     * This also supports {"members": [...]}
     * in case you change the JSON later.
     */
    const members = Array.isArray(data)
      ? data
      : data.members;

    if (!Array.isArray(members)) {
      throw new Error(
        "No members array was found."
      );
    }

    // Only Silver and Gold members
    const qualifiedMembers = members.filter(
      (member) => {
        const membershipLevel = Number(
          member.membershipLevel
        );

        return (
          membershipLevel === 2 ||
          membershipLevel === 3
        );
      }
    );

    const randomMembers = shuffleMembers(
      qualifiedMembers
    ).slice(0, 3);

    displaySpotlightMembers(randomMembers);
  } catch (error) {
    console.error(
      "Unable to load business spotlights:",
      error
    );

    spotlightContainer.textContent =
      "Business spotlights are unavailable.";
  }
}


// ==========================================
// RANDOMIZE MEMBER ORDER
// ==========================================

function shuffleMembers(members) {
  const shuffledMembers = [...members];

  for (
    let index = shuffledMembers.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [
      shuffledMembers[index],
      shuffledMembers[randomIndex]
    ] = [
      shuffledMembers[randomIndex],
      shuffledMembers[index]
    ];
  }

  return shuffledMembers;
}


// ==========================================
// DISPLAY SPOTLIGHT CARDS
// ==========================================

function displaySpotlightMembers(members) {
  spotlightContainer.innerHTML = "";

  if (members.length === 0) {
    spotlightContainer.textContent =
      "No Silver or Gold members were found.";

    return;
  }

  members.forEach((member) => {
    const membershipLevel = Number(
      member.membershipLevel
    );

    const card = document.createElement("article");
    const businessName = document.createElement("h3");
    const content = document.createElement("div");
    const image = document.createElement("img");
    const phone = document.createElement("p");
    const address = document.createElement("p");
    const website = document.createElement("a");
    const membership = document.createElement("p");

    card.classList.add("spotlight-card");
    content.classList.add("spotlight-content");

    businessName.textContent = member.name;

    image.src = `images/${member.image}`;
    image.alt = `${member.name} business`;
    image.loading = "lazy";
    image.width = 140;
    image.height = 110;

    phone.textContent = `Phone: ${member.phone}`;
    address.textContent =
      `Address: ${member.address}`;

    website.textContent = "Visit Website";
    website.href = member.website;
    website.target = "_blank";
    website.rel = "noopener";

    membership.textContent =
      spotlightMembershipNames[membershipLevel];

    membership.classList.add(
      "membership",
      `membership-${membershipLevel}`
    );

    content.appendChild(image);
    content.appendChild(phone);
    content.appendChild(address);
    content.appendChild(website);
    content.appendChild(membership);

    card.appendChild(businessName);
    card.appendChild(content);

    spotlightContainer.appendChild(card);
  });
}


// ==========================================
// RUN HOME PAGE FUNCTIONS
// ==========================================

getCurrentWeather();
getWeatherForecast();
getSpotlightMembers();