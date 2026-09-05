const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#main-navigation");

menuButton.addEventListener("click", () => {
  navigation.classList.toggle("open");

  const isOpen = navigation.classList.contains("open");

  menuButton.setAttribute("aria-expanded", isOpen);

  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );

  menuButton.textContent = isOpen ? "✕" : "☰";
});