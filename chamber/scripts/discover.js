import { places } from "../data/places.mjs";

const cardsContainer = document.querySelector("#discover-cards");


function displayPlaces() {

  places.forEach((place, index) => {

    const card = document.createElement("article");

    card.classList.add("discover-card");

    // Required for named grid areas
    card.classList.add(`card${index + 1}`);


    // h2 requirement
    const title = document.createElement("h2");
    title.textContent = place.name;


    // figure requirement
    const figure = document.createElement("figure");

    const image = document.createElement("img");

    image.src = place.image;
    image.alt = place.name;

    image.width = 300;
    image.height = 200;

    image.loading = "lazy";

    figure.appendChild(image);


    // address requirement
    const address = document.createElement("address");
    address.textContent = place.address;


    // paragraph requirement
    const description = document.createElement("p");
    description.textContent = place.description;


    // button requirement
    const button = document.createElement("button");

    button.textContent = "Learn More";
    button.type = "button";


    card.appendChild(title);
    card.appendChild(figure);
    card.appendChild(address);
    card.appendChild(description);
    card.appendChild(button);


    cardsContainer.appendChild(card);

  });

}


displayPlaces();



/* =====================================
   LAST VISIT
   Assignment Requirement #11
===================================== */

const visitMessage =
  document.querySelector("#visit-message");


const currentDate = Date.now();

const lastVisit =
  localStorage.getItem("lastVisit");


const millisecondsPerDay =
  1000 * 60 * 60 * 24;


if (lastVisit === null) {

  visitMessage.textContent =
    "Welcome! Let us know if you have any questions.";

} else {

  const difference =
    currentDate - Number(lastVisit);


  const days =
    Math.floor(
      difference / millisecondsPerDay
    );


  if (days < 1) {

    visitMessage.textContent =
      "Back so soon! Awesome!";

  } else if (days === 1) {

    visitMessage.textContent =
      "You last visited 1 day ago.";

  } else {

    visitMessage.textContent =
      `You last visited ${days} days ago.`;

  }

}


localStorage.setItem(
  "lastVisit",
  currentDate
);