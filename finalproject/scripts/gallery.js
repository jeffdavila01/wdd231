import { fetchPhotos } from "./data.js";

const grid = document.querySelector("#photo-grid");
const filter = document.querySelector("#category-filter");
const status = document.querySelector("#gallery-status");
const retryButton = document.querySelector("#retry-button");

const dialog = document.querySelector("#photo-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogImage = document.querySelector("#dialog-image");
const dialogImageStatus = document.querySelector("#dialog-image-status");
const dialogCategory = document.querySelector("#dialog-category");
const dialogOrientation = document.querySelector("#dialog-orientation");
const dialogDescription = document.querySelector("#dialog-description");

const storageKey = "casil-shots-gallery-category";
const allowedCategories = ["all", "wedding", "birthday", "portrait"];

const categoryNames = {
  wedding: "Wedding",
  birthday: "Birthday",
  portrait: "Portrait"
};

let photos = [];
let previousFocus = null;

function getInitialCategory() {
  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category");

  if (allowedCategories.includes(requestedCategory)) {
    return requestedCategory;
  }

  try {
    const savedCategory = localStorage.getItem(storageKey);

    if (allowedCategories.includes(savedCategory)) {
      return savedCategory;
    }
  } catch {
    // The gallery still works when browser storage is unavailable.
  }

  return "all";
}

function saveCategory(category) {
  try {
    localStorage.setItem(storageKey, category);
  } catch {
    // Saving preferences is optional for browsing the gallery.
  }
}

function createParagraph(className, text) {
  const paragraph = document.createElement("p");
  paragraph.className = className;
  paragraph.textContent = text;
  return paragraph;
}

function createPhotoCard(photo) {
  const card = document.createElement("article");
  card.className = "photo-card";

  const media = document.createElement("div");
  media.className = "photo-media";

  const image = document.createElement("img");
  image.alt = photo.alt;
  image.loading = "lazy";
  image.decoding = "async";
  image.width = 600;
  image.height = 400;

  image.addEventListener("error", () => {
    const message = document.createElement("p");
    message.textContent = "Photo unavailable.";
    media.replaceChildren(message);
  }, { once: true });

  image.src = photo.image;
  media.append(image);

  const copy = document.createElement("div");
  copy.className = "photo-copy";

  const category = createParagraph(
    "photo-category",
    categoryNames[photo.category] ?? photo.category
  );

  const title = document.createElement("h3");
  title.textContent = photo.title;

  const orientation = createParagraph(
    "photo-orientation",
    `Orientation: ${photo.orientation}`
  );

  const description = createParagraph(
    "photo-description",
    photo.description
  );

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button button-outline";
  button.textContent = "View Details";
  button.dataset.photoId = photo.id;
  button.setAttribute("aria-label", `View details for ${photo.title}`);
  button.setAttribute("aria-haspopup", "dialog");

  copy.append(category, title, orientation, description, button);
  card.append(media, copy);

  return card;
}

function renderPhotos() {
  const category = filter.value;

  const visiblePhotos = photos.filter((photo) =>
    category === "all" || photo.category === category
  );

  const fragment = document.createDocumentFragment();

  visiblePhotos.forEach((photo) => {
    fragment.append(createPhotoCard(photo));
  });

  grid.replaceChildren(fragment);

  status.textContent =
    `Showing ${visiblePhotos.length} of ${photos.length} photographs.`;
}

function openPhoto(photo, trigger) {
  previousFocus = trigger;

  dialogTitle.textContent = photo.title;
  dialogCategory.textContent =
    categoryNames[photo.category] ?? photo.category;
  dialogOrientation.textContent = photo.orientation;
  dialogDescription.textContent = photo.description;

  dialogImage.hidden = true;
  dialogImageStatus.hidden = true;
  dialogImage.alt = photo.alt;

  dialogImage.onload = () => {
    dialogImage.hidden = false;
  };

  dialogImage.onerror = () => {
    dialogImage.hidden = true;
    dialogImageStatus.hidden = false;
  };

  dialogImage.src = photo.image;

  dialog.showModal();
  document.body.classList.add("modal-open");
}

async function loadGallery() {
  grid.setAttribute("aria-busy", "true");
  filter.disabled = true;
  retryButton.hidden = true;
  status.textContent = "Loading photographs…";

  try {
    photos = await fetchPhotos();
    renderPhotos();
    filter.disabled = false;
  } catch {
    grid.replaceChildren();
    status.textContent =
      "The gallery could not be loaded. Please try again.";
    retryButton.hidden = false;
  } finally {
    grid.setAttribute("aria-busy", "false");
  }
}

filter.value = getInitialCategory();

filter.addEventListener("change", () => {
  saveCategory(filter.value);

  // Keep category links and the saved preference in agreement.
  const url = new URL(window.location.href);

  if (filter.value === "all") {
    url.searchParams.delete("category");
  } else {
    url.searchParams.set("category", filter.value);
  }

  window.history.replaceState(null, "", url);
  renderPhotos();
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-photo-id]");

  if (!button) {
    return;
  }

  const photo = photos.find((item) => item.id === button.dataset.photoId);

  if (photo) {
    openPhoto(photo, button);
  }
});

dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  previousFocus?.focus();
});

retryButton.addEventListener("click", loadGallery);

loadGallery();