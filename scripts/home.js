// ==========================================
// HAMBURGER MENU
// ==========================================

const menuButton = document.querySelector(".menu-toggle");
const hamburgerIcon = document.querySelector(".hamburger");
const navigation = document.querySelector(".header-content");

if (menuButton && hamburgerIcon && navigation) {
  menuButton.addEventListener("click", function () {
    navigation.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");

    hamburgerIcon.textContent = isOpen ? "✕" : "☰";

    menuButton.setAttribute(
      "aria-expanded",
      isOpen
    );

    menuButton.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );
  });
}


// ==========================================
// COURSE INFORMATION
// ==========================================

const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    completed: true
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    completed: true
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    completed: true
  }
];

const courseList = document.querySelector("#course-list");
const totalCredits = document.querySelector("#totalCredits");

const allButton = document.querySelector("#all-courses");
const wddButton = document.querySelector("#wdd-courses");
const cseButton = document.querySelector("#cse-courses");


// ==========================================
// DISPLAY COURSES
// ==========================================

function displayCourses(filteredCourses) {
  if (!courseList || !totalCredits) {
    return;
  }

  courseList.innerHTML = "";

  filteredCourses.forEach(function (course) {
    const courseCard = document.createElement("div");

    const courseName =
      `${course.subject} ${course.number}`;

    courseCard.classList.add("course-card");

    if (course.completed) {
      courseCard.classList.add("completed");
      courseCard.textContent = `${courseName} ✓`;

      courseCard.setAttribute(
        "aria-label",
        `${courseName}, completed`
      );
    } else {
      courseCard.textContent = courseName;

      courseCard.setAttribute(
        "aria-label",
        `${courseName}, not completed`
      );
    }

    courseList.appendChild(courseCard);
  });

  const credits = filteredCourses.reduce(
    function (total, course) {
      return total + course.credits;
    },
    0
  );

  totalCredits.textContent = credits;
}


// ==========================================
// COURSE FILTER BUTTONS
// ==========================================

if (allButton) {
  allButton.addEventListener("click", function () {
    displayCourses(courses);
  });
}

if (wddButton) {
  wddButton.addEventListener("click", function () {
    const wddCourses = courses.filter(function (course) {
      return course.subject === "WDD";
    });

    displayCourses(wddCourses);
  });
}

if (cseButton) {
  cseButton.addEventListener("click", function () {
    const cseCourses = courses.filter(function (course) {
      return course.subject === "CSE";
    });

    displayCourses(cseCourses);
  });
}

// Show all courses when the page opens
displayCourses(courses);


// ==========================================
// FOOTER
// ==========================================

const currentYear = document.querySelector("#currentYear");
const lastModified = document.querySelector("#lastModified");

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