const timestampInput = document.querySelector("#timestamp");

if (timestampInput) {
  timestampInput.value = new Date().toISOString();
}

document.querySelectorAll("[data-dialog]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const dialog = document.getElementById(link.dataset.dialog);

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  });
});

document.querySelectorAll(".close-dialog").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest("dialog").close();
  });
});