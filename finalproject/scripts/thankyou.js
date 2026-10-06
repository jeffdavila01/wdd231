const parameters = new URLSearchParams(window.location.search);

const firstName = parameters.get("firstName")?.trim() || "";
const lastName = parameters.get("lastName")?.trim() || "";
const email = parameters.get("email")?.trim() || "";
const phone = parameters.get("phone")?.trim() || "";
const service = parameters.get("service")?.trim() || "";
const eventDate = parameters.get("eventDate")?.trim() || "";
const location = parameters.get("location")?.trim() || "";
const message = parameters.get("message")?.trim() || "";

const fullName = `${firstName} ${lastName}`.trim();

const customerName = document.querySelector("#customer-name");

const summaryName = document.querySelector("#summary-name");
const summaryEmail = document.querySelector("#summary-email");
const summaryPhone = document.querySelector("#summary-phone");
const summaryService = document.querySelector("#summary-service");
const summaryDate = document.querySelector("#summary-date");
const summaryLocation = document.querySelector("#summary-location");
const summaryMessage = document.querySelector("#summary-message");


function displayValue(element, value, fallback = "Not provided") {
  if (!element) {
    return;
  }

  element.textContent = value || fallback;
}


function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const parts = dateValue.split("-");

  if (parts.length !== 3) {
    return dateValue;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);

  const date = new Date(year, month, day);

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}


if (customerName) {
  customerName.textContent = firstName || "Guest";
}


displayValue(
  summaryName,
  fullName
);

displayValue(
  summaryEmail,
  email
);

displayValue(
  summaryPhone,
  phone
);

displayValue(
  summaryService,
  service
);

displayValue(
  summaryDate,
  formatDate(eventDate)
);

displayValue(
  summaryLocation,
  location
);

displayValue(
  summaryMessage,
  message,
  "No additional message provided."
);