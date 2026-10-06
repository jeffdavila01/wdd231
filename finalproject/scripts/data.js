export async function fetchPhotos() {
  const url = new URL("../data/photos.json", import.meta.url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Photo request failed: HTTP ${response.status}`);
    }

    const photos = await response.json();

    if (!Array.isArray(photos) || photos.length === 0) {
      throw new Error("The photo collection is empty or invalid.");
    }

    const requiredFields = [
      "id",
      "title",
      "category",
      "orientation",
      "description",
      "image",
      "alt"
    ];

    const valid = photos.every((photo) =>
      photo !== null &&
      typeof photo === "object" &&
      requiredFields.every((field) =>
        typeof photo[field] === "string" &&
        photo[field].trim().length > 0
      )
    );

    if (!valid) {
      throw new Error("A photo entry is missing required information.");
    }

    return photos;
  } catch (error) {
    console.error("Unable to retrieve the photo collection:", error);
    throw error;
  }
}