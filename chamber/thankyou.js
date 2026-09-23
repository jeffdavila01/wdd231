const applicationParams = new URLSearchParams(window.location.search);

const detailsContainer = document.querySelector("#application-details");
const confirmationMessage = document.querySelector("#confirmation-message");

const requiredFields = [
  ["firstName", "First Name"],
  ["lastName", "Last Name"],
  ["email", "Email Address"],
  ["phone", "Mobile Number"],
  ["businessName", "Business / Organization"],
  ["timestamp", "Form Loaded At"]
];

const membershipLabels = {
  np: "NP Membership",
  bronze: "Bronze Membership",
  silver: "Silver Membership",
  gold: "Gold Membership"
};

function addDetail(label, value) {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  term.textContent = label;
  description.textContent = value;

  row.append(term, description);
  detailsContainer.appendChild(row);
}

const hasRequiredDetails = requiredFields.every(([key]) => {
  return applicationParams.get(key)?.trim();
});

if (!hasRequiredDetails) {
  confirmationMessage.textContent =
    "Some application details are missing. Please return to the Join page and complete the form.";

  const joinLink = document.createElement("a");
  joinLink.href = "join.html";
  joinLink.textContent = "Return to the application form";
  confirmationMessage.append(" ", joinLink);
}

requiredFields.forEach(([key, label]) => {
  let value = applicationParams.get(key) || "Not provided";

  if (key === "timestamp" && applicationParams.get(key)) {
    const date = new Date(applicationParams.get(key));

    value = Number.isNaN(date.getTime())
      ? "Invalid timestamp"
      : new Intl.DateTimeFormat("en-PH", {
          dateStyle: "long",
          timeStyle: "short",
          timeZone: "Asia/Manila"
        }).format(date) + " (Philippine time)";
  }

  addDetail(label, value);
});

const selectedMembership = applicationParams.get("membership");

if (selectedMembership) {
  addDetail(
    "Membership Level",
    membershipLabels[selectedMembership] || "Unknown membership"
  );
}