const menuButton = document.querySelector("#menu-button");
const menuSymbol = document.querySelector("#menu-symbol");
const navigation = document.querySelector("#main-navigation");
const currentYear = document.querySelector("#current-year");

if (menuButton && navigation) {
  menuButton.hidden = false;

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isOpen));

    navigation.classList.toggle("open", !isOpen);

    if (menuSymbol) {
      menuSymbol.textContent = isOpen ? "☰" : "✕";
    }

    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Open navigation menu" : "Close navigation menu"
    );
  });
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}