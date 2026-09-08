
/* ==============================
   VARIABLES
================================ */

let currentMode = "add";

let scanner = null;

let lastScannedCode = "";

let lastScanTime = 0;


/* ==============================
   GET PRODUCTS
================================ */

function getProducts() {

  return JSON.parse(
    localStorage.getItem("products")
  ) || {};

}


/* ==============================
   SAVE PRODUCTS
================================ */

function saveProducts(products) {

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );

}


/* ==============================
   SWITCH TO ADD MODE
================================ */

document
  .getElementById("addModeBtn")
  .addEventListener("click", function () {

    currentMode = "add";


    document
      .getElementById("addSection")
      .classList.remove("hidden");


    document
      .getElementById("scanSection")
      .classList.add("hidden");


    this.className = "active";


    document
      .getElementById("scanModeBtn")
      .className = "inactive";


    document
      .getElementById("status")
      .textContent = "Add Product Mode";

  });


/* ==============================
   SWITCH TO SCAN MODE
================================ */

document
  .getElementById("scanModeBtn")
  .addEventListener("click", function () {

    currentMode = "scan";


    document
      .getElementById("scanSection")
      .classList.remove("hidden");


    document
      .getElementById("addSection")
      .classList.add("hidden");


    this.className = "active";


    document
      .getElementById("addModeBtn")
      .className = "inactive";


    document
      .getElementById("status")
      .textContent = "Scan Product Mode";

  });


/* ==============================
   SAVE PRODUCT
================================ */

document
  .getElementById("saveProduct")
  .addEventListener("click", function () {

    const barcode =
      document
        .getElementById("barcodeInput")
        .value
        .trim();


    const name =
      document
        .getElementById("productName")
        .value
        .trim();


    const price =
      document
        .getElementById("productPrice")
        .value
        .trim();


    /* CHECK EMPTY FIELDS */

    if (!barcode || !name || !price) {

      alert(
        "Please enter barcode, product name and price."
      );

      return;

    }


    /* CHECK PRICE */

    if (Number(price) <= 0) {

      alert("Please enter a valid price.");

      return;

    }


    const products = getProducts();


    /* CHECK IF BARCODE ALREADY EXISTS */

    if (products[barcode]) {

      const replaceProduct = confirm(
        "This barcode already exists. Do you want to update the product?"
      );


      if (!replaceProduct) {

        return;

      }

    }


    /* SAVE PRODUCT */

    products[barcode] = {

      barcode: barcode,

      name: name,

      price: Number(price)

    };


    saveProducts(products);


    alert("Product saved successfully!");


    /* CLEAR INPUTS */

    document
      .getElementById("barcodeInput")
      .value = "";


    document
      .getElementById("productName")
      .value = "";


    document
      .getElementById("productPrice")
      .value = "";


    document
      .getElementById("status")
      .textContent = "✅ Product saved";


    displayProducts();

  });


/* ==============================
   FIND PRODUCT
================================ */

function findProduct(barcode) {

  barcode = barcode.trim();


  const products = getProducts();


  const product = products[barcode];


  const result =
    document.getElementById("result");


  if (product) {

    document
      .getElementById("resultName")
      .textContent = product.name;


    document
      .getElementById("resultBarcode")
      .textContent = product.barcode;


    document
      .getElementById("resultPrice")
      .textContent =
      Number(product.price).toFixed(2);


    result.style.display = "block";


    document
      .getElementById("status")
      .textContent =
      "✅ Product Found";

  }

  else {

    result.style.display = "none";


    document
      .getElementById("status")
      .textContent =
      "❌ Product not found";

  }

}


/* ==============================
   MANUAL SEARCH
================================ */

document
  .getElementById("searchProduct")
  .addEventListener("click", function () {

    const barcode =
      document
        .getElementById("searchBarcode")
        .value
        .trim();


    if (!barcode) {

      alert("Enter or scan a barcode.");

      return;

    }


    findProduct(barcode);

  });


/* ==============================
   PRESS ENTER TO SEARCH
================================ */

document
  .getElementById("searchBarcode")
  .addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

      findProduct(this.value);

    }

  });


/* ==============================
   BARCODE SCANNED
================================ */

function onScanSuccess(decodedText) {

  const now = Date.now();


  /*
    Prevent scanning the exact
    same barcode repeatedly.
  */

  if (
    decodedText === lastScannedCode &&
    now - lastScanTime < 2000
  ) {

    return;

  }


  lastScannedCode = decodedText;

  lastScanTime = now;


  /* ADD PRODUCT MODE */

  if (currentMode === "add") {

    document
      .getElementById("barcodeInput")
      .value = decodedText;


    document
      .getElementById("status")
      .textContent =
      "✅ Barcode scanned: " + decodedText;


    /*
      Move cursor directly
      to product name.
    */

    document
      .getElementById("productName")
      .focus();

  }


  /* SCAN PRODUCT MODE */

  else {

    document
      .getElementById("searchBarcode")
      .value = decodedText;


    findProduct(decodedText);

  }

}


/* ==============================
   START CAMERA
================================ */

document
  .getElementById("startCamera")
  .addEventListener("click", async function () {

    if (scanner) {

      return;

    }


    scanner =
      new Html5Qrcode("reader");


    try {

      const cameras =
        await Html5Qrcode.getCameras();


      if (
        !cameras ||
        cameras.length === 0
      ) {

        alert("No camera found.");


        scanner = null;


        return;

      }


      /*
        Usually the last camera
        is the back camera
        on a mobile phone.
      */

      const cameraId =
        cameras[cameras.length - 1].id;


      await scanner.start(

        cameraId,

        {

          fps: 10,

          qrbox: {

            width: 280,

            height: 160

          }

        },

        onScanSuccess,

        function () {

          /*
            Scanner checks frames
            continuously.

            Normal scan failures
            are ignored.
          */

        }

      );


      document
        .getElementById("status")
        .textContent =
        "📷 Camera running. Point it at a barcode.";

    }


    catch (error) {

      console.error(error);


      alert(
        "Camera could not start. Allow camera permission and make sure the website uses HTTPS."
      );


      scanner = null;

    }

  });


/* ==============================
   STOP CAMERA
================================ */

document
  .getElementById("stopCamera")
  .addEventListener("click", async function () {

    if (!scanner) {

      return;

    }


    try {

      await scanner.stop();


      await scanner.clear();

    }


    catch (error) {

      console.log(error);

    }


    scanner = null;


    document
      .getElementById("status")
      .textContent =
      "Camera stopped.";

  });


/* ==============================
   DISPLAY PRODUCTS
================================ */

function displayProducts() {

  const products =
    getProducts();


  const productList =
    document.getElementById("productList");


  productList.innerHTML = "";


  const productArray =
    Object.values(products);


  /* NO PRODUCTS */

  if (productArray.length === 0) {

    productList.innerHTML =
      "<p>No products saved yet.</p>";


    return;

  }


  /* SHOW EVERY PRODUCT */

  productArray.forEach(function (product) {

    const div =
      document.createElement("div");


    div.className = "product-item";


    div.innerHTML = `

      <strong>
        ${escapeHTML(product.name)}
      </strong>

      <br>

      Barcode:
      ${escapeHTML(product.barcode)}

      <br>

      Price:
      ₱${Number(product.price).toFixed(2)}

      <br>

      <button
        type="button"
        data-barcode="${escapeHTML(product.barcode)}"
        class="delete-btn"
      >
        Delete
      </button>

    `;


    productList.appendChild(div);

  });


  /* DELETE BUTTONS */

  document
    .querySelectorAll(".delete-btn")
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const barcode =
            this.dataset.barcode;


          const confirmDelete =
            confirm(
              "Delete this product?"
            );


          if (!confirmDelete) {

            return;

          }


          const products =
            getProducts();


          delete products[barcode];


          saveProducts(products);


          displayProducts();

        }

      );

    });

}


/* ==============================
   BASIC HTML SAFETY
================================ */

function escapeHTML(text) {

  return String(text)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


/* ==============================
   INITIAL LOAD
================================ */

displayProducts();

