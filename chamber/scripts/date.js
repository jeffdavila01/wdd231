const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
  const modifiedDate = new Date(document.lastModified);

  const formattedDate = modifiedDate.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  lastModified.textContent =
    `Last modified: ${formattedDate}`;
}