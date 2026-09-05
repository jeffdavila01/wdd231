const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");

const membersURL = "./data/members.json";

const membershipNames = {
  1: "Member",
  2: "Silver Member",
  3: "Gold Member"
};


// ==========================================
// GET MEMBER DATA
// ==========================================

async function getMembers() {
  try {
    const response = await fetch(membersURL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const members = await response.json();

    displayMembers(members);
  } catch (error) {
    console.error("Unable to load members:", error);

    membersContainer.textContent =
      "Sorry, the business directory could not be loaded.";
  }
}


// ==========================================
// DISPLAY MEMBER CARDS
// ==========================================

function displayMembers(members) {
  membersContainer.innerHTML = "";

  members.forEach((member) => {
    const card = document.createElement("section");
    const image = document.createElement("img");
    const businessName = document.createElement("h2");
    const membership = document.createElement("p");
    const category = document.createElement("p");
    const description = document.createElement("p");
    const address = document.createElement("p");
    const phone = document.createElement("p");
    const website = document.createElement("a");

    card.classList.add("member-card");

    image.src = `images/${member.image}`;
    image.alt = `${member.name} business`;
    image.loading = "lazy";
    image.width = 600;
    image.height = 400;

    businessName.textContent = member.name;

    membership.textContent =
      membershipNames[member.membershipLevel];

    membership.classList.add(
      "membership",
      `membership-${member.membershipLevel}`
    );

    category.textContent = member.category;
    category.classList.add("category");

    description.textContent = member.description;
    description.classList.add("description");

    address.textContent = member.address;
    address.classList.add("address");

    phone.textContent = member.phone;
    phone.classList.add("phone");

    website.textContent = "Visit Website";
    website.href = member.website;
    website.target = "_blank";
    website.rel = "noopener";
    website.classList.add("website-link");

    card.appendChild(image);
    card.appendChild(businessName);
    card.appendChild(membership);
    card.appendChild(category);
    card.appendChild(description);
    card.appendChild(address);
    card.appendChild(phone);
    card.appendChild(website);

    membersContainer.appendChild(card);
  });
}


// ==========================================
// GRID VIEW
// ==========================================

gridButton.addEventListener("click", () => {
  membersContainer.classList.add("members-grid");
  membersContainer.classList.remove("members-list");

  gridButton.classList.add("active");
  listButton.classList.remove("active");

  gridButton.setAttribute("aria-pressed", "true");
  listButton.setAttribute("aria-pressed", "false");
});


// ==========================================
// LIST VIEW
// ==========================================

listButton.addEventListener("click", () => {
  membersContainer.classList.add("members-list");
  membersContainer.classList.remove("members-grid");

  listButton.classList.add("active");
  gridButton.classList.remove("active");

  listButton.setAttribute("aria-pressed", "true");
  gridButton.setAttribute("aria-pressed", "false");
});


getMembers();