const SPREADSHEET_ID = "1_tPkKLtIzg4TVnnbcKr2Y6mwovDrip1uOyysf_poPiM";





// ======================================================

// WEB APP

// ======================================================



function doGet() {

  return HtmlService.createTemplateFromFile("index")

    .evaluate()

    .setTitle("Inventory & Sales System")

    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}





// ======================================================

// SPREADSHEET

// ======================================================



function getSpreadsheet() {

  if (SPREADSHEET_ID) {

    return SpreadsheetApp.openById(SPREADSHEET_ID);

  }



  return SpreadsheetApp.getActiveSpreadsheet();

}





// ======================================================

// SETUP SYSTEM

// ======================================================



function setupSystem() {

  const ss = getSpreadsheet();



  createSheetIfNeeded\_(ss, "Products", [

    "Product ID",

    "Product Name",

    "Category",

    "Unit",

    "Selling Price",

    "Active",

    "Inventory Type"

  ]);



  createSheetIfNeeded\_(ss, "Inventory", [

    "Timestamp",

    "Date",

    "Product ID",

    "Product Name",

    "Inventory Type",

    "Beginning Raw",

    "Beginning Loose",

    "Delivery",

    "Delivery Converted",

    "Out From Freezer",

    "Beginning Cooked",

    "Cooked Today",

    "Ending Cooked",

    "Ending Raw",

    "Ending Loose",

    "Raw Remaining",

    "Sold / Used",

    "Staff 1",

    "Staff 2",

    "Staff 3"

  ]);



  createSheetIfNeeded\_(ss, "Sales", [

    "Timestamp",

    "Date",

    "Product ID",

    "Product Name",

    "GCash",

    "Grab",

    "Price",

    "Quantity",

    "Amount"

  ]);



  createSheetIfNeeded\_(ss, "Daily Reports", [

    "Timestamp",

    "Date",

    "Staff 1",

    "Staff 2",

    "Staff 3",

    "Gross Sales",

    "Discount",

    "Expenses",

    "Net Sales",

    "Actual Count",

    "Over/Short"

  ]);



  const productSheet = ss.getSheetByName("Products");



  // Make sure old existing products receive an Inventory Type.

  updateExistingProductTypes\_(productSheet);



  // IMPORTANT FIX:

  // Add missing required inventory products even if Products

  // already contains other records.

  ensureRequiredInventoryProducts\_(productSheet);



  formatSheets\_(ss);



  return "System setup completed. Meat, Tokwa, Egg, Drink, Lumpia and Kwek Kwek inventory products are ready.";

}





// ======================================================

// CREATE SHEET IF NEEDED

// ======================================================



function createSheetIfNeeded\_(ss, sheetName, headers) {

  let sheet = ss.getSheetByName(sheetName);



  if (!sheet) {

    sheet = ss.insertSheet(sheetName);

  }



  // Make sure the sheet has enough columns.

  if (sheet.getMaxColumns() < headers.length) {

    sheet.insertColumnsAfter(

      sheet.getMaxColumns(),

      headers.length - sheet.getMaxColumns()

    );

  }



  // Update headers without deleting existing data.

  sheet

    .getRange(1, 1, 1, headers.length)

    .setValues([headers]);



  sheet.setFrozenRows(1);

}





// ======================================================

// ENSURE REQUIRED INVENTORY PRODUCTS

// ======================================================



function ensureRequiredInventoryProducts\_(sheet) {



  /\*

   \* These are the stocks that MUST appear in the

   \* Inventory page.

   \*

   \* The function:

   \* 1. Finds existing products by name.

   \* 2. Corrects their Inventory Type.

   \* 3. Makes sure Active = TRUE.

   \* 4. Adds the product if it does not exist.

   \*

   \* It does NOT delete existing products.

   \*/



  const requiredProducts = [



    // -------------------------

    // MEAT

    // -------------------------



    {

      id: "M001",

      name: "Goto",

      category: "Stock",

      unit: "kg / grams",

      price: 0,

      active: true,

      type: "MEAT",

      aliases: ["goto"]

    },



    {

      id: "M002",

      name: "Chicken",

      category: "Stock",

      unit: "kg / grams",

      price: 0,

      active: true,

      type: "MEAT",

      aliases: ["chicken"]

    },



    {

      id: "M003",

      name: "Pork",

      category: "Stock",

      unit: "kg / grams",

      price: 0,

      active: true,

      type: "MEAT",

      aliases: [

        "pork",

        "pork jowls",

        "pork jowl"

      ]

    },





    // -------------------------

    // TOKWA

    // -------------------------



    {

      id: "T001",

      name: "Tokwa",

      category: "Stock",

      unit: "plastic / pcs / grams",

      price: 0,

      active: true,

      type: "TOKWA",

      aliases: [

        "tokwa",

        "fresh tokwa"

      ]

    },





    // -------------------------

    // EGG

    // -------------------------



    {

      id: "E001",

      name: "Egg",

      category: "Stock",

      unit: "tray / pcs",

      price: 0,

      active: true,

      type: "EGG",

      aliases: [

        "egg",

        "eggs"

      ]

    },





    // -------------------------

    // DRINKS

    // -------------------------



    {

      id: "D001",

      name: "Coke Regular",

      category: "Drink",

      unit: "box / pcs",

      price: 60,

      active: true,

      type: "DRINK",

      aliases: [

        "coke regular"

      ]

    },



    {

      id: "D002",

      name: "Coke Zero",

      category: "Drink",

      unit: "box / pcs",

      price: 60,

      active: true,

      type: "DRINK",

      aliases: [

        "coke zero"

      ]

    },



    {

      id: "D003",

      name: "Royal",

      category: "Drink",

      unit: "box / pcs",

      price: 60,

      active: true,

      type: "DRINK",

      aliases: [

        "royal"

      ]

    },



    {

      id: "D004",

      name: "Sprite",

      category: "Drink",

      unit: "box / pcs",

      price: 60,

      active: true,

      type: "DRINK",

      aliases: [

        "sprite"

      ]

    },



    {

      id: "D005",

      name: "Water Small",

      category: "Drink",

      unit: "box / pcs",

      price: 25,

      active: true,

      type: "DRINK",

      aliases: [

        "water small",

        "water"

      ]

    },



    {

      id: "D006",

      name: "Juice",

      category: "Drink",

      unit: "box / pcs",

      price: 25,

      active: true,

      type: "DRINK",

      aliases: [

        "juice"

      ]

    },

    // -------------------------
    // PIECE STOCKS
    // -------------------------

    {
      id: "P001",
      name: "Lumpia",
      category: "Stock",
      unit: "pcs",
      price: 0,
      active: true,
      type: "PIECE",
      aliases: ["lumpia"]
    },

    {
      id: "P002",
      name: "Kwek Kwek",
      category: "Stock",
      unit: "pcs",
      price: 0,
      active: true,
      type: "PIECE",
      aliases: ["kwek kwek", "kwek-kwek", "kwek2x"]
    }




  ];





  let existingData = [];



  if (sheet.getLastRow() >= 2) {

    existingData = sheet

      .getRange(

        2,

        1,

        sheet.getLastRow() - 1,

        7

      )

      .getValues();

  }





  requiredProducts.forEach(required => {



    const matchingIndex = existingData.findIndex(row => {



      const existingName = normalizeName\_(row[1]);



      return required.aliases.some(alias =>

        existingName === normalizeName\_(alias)

      );



    });





    // ==================================================

    // EXISTING PRODUCT

    // ==================================================



    if (matchingIndex !== -1) {



      const sheetRow = matchingIndex + 2;



      const currentRow = existingData[matchingIndex];





      // Keep existing Product ID when it already has one.

      if (!currentRow[0]) {

        sheet

          .getRange(sheetRow, 1)

          .setValue(required.id);



        currentRow[0] = required.id;

      }





      // Keep existing product name so old records continue

      // to make sense, but make sure required fields are correct.



      sheet

        .getRange(sheetRow, 3)

        .setValue(required.category);



      sheet

        .getRange(sheetRow, 4)

        .setValue(required.unit);





      // Only use default price if existing price is blank.

      if (

        currentRow[4] === "" ||

        currentRow[4] === null

      ) {

        sheet

          .getRange(sheetRow, 5)

          .setValue(required.price);



        currentRow[4] = required.price;

      }





      sheet

        .getRange(sheetRow, 6)

        .setValue(true);



      sheet

        .getRange(sheetRow, 7)

        .setValue(required.type);





      currentRow[2] = required.category;

      currentRow[3] = required.unit;

      currentRow[5] = true;

      currentRow[6] = required.type;



    }





    // ==================================================

    // PRODUCT DOES NOT EXIST

    // ==================================================



    else {



      const newRow = [

        required.id,

        required.name,

        required.category,

        required.unit,

        required.price,

        true,

        required.type

      ];





      sheet.appendRow(newRow);



      existingData.push(newRow);



    }



  });



}





// ======================================================

// UPDATE OLD EXISTING PRODUCT TYPES

// ======================================================



function updateExistingProductTypes\_(sheet) {



  if (sheet.getLastRow() < 2) {

    return;

  }





  const range = sheet.getRange(

    2,

    1,

    sheet.getLastRow() - 1,

    7

  );





  const values = range.getValues();





  values.forEach(row => {



    const name =

      normalizeName\_(row[1]);





    let type =

      String(row[6] || "")

        .trim()

        .toUpperCase();





    // Only automatically classify when Inventory Type

    // is blank.



    if (type) {

      return;

    }





    if (

      name === "goto" ||

      name === "chicken" ||

      name === "pork" ||

      name === "pork jowls" ||

      name === "pork jowl"

    ) {



      type = "MEAT";



    }



    else if (

      name === "tokwa" ||

      name === "fresh tokwa"

    ) {



      type = "TOKWA";



    }



    else if (

      name === "egg" ||

      name === "eggs"

    ) {



      type = "EGG";



    }



    else if (

      name.includes("coke") ||

      name.includes("royal") ||

      name.includes("sprite") ||

      name.includes("water") ||

      name.includes("juice")

    ) {



      type = "DRINK";



    }



    else if (
      name === "lumpia" ||
      name === "kwek kwek" ||
      name === "kwek-kwek" ||
      name === "kwek2x"
    ) {

      type = "PIECE";

    }

    else {



      type = "STANDARD";



    }





    row[6] = type;



  });





  range.setValues(values);

}





// ======================================================

// FORMAT SHEETS

// ======================================================



function formatSheets\_(ss) {



  [

    "Products",

    "Inventory",

    "Sales",

    "Daily Reports"

  ].forEach(name => {



    const sheet =

      ss.getSheetByName(name);





    if (!sheet) {

      return;

    }





    const lastColumn =

      sheet.getLastColumn();





    if (lastColumn === 0) {

      return;

    }





    sheet

      .getRange(

        1,

        1,

        1,

        lastColumn

      )

      .setFontWeight("bold")

      .setBackground("#17324d")

      .setFontColor("#ffffff");





    sheet.setFrozenRows(1);



    sheet.autoResizeColumns(

      1,

      lastColumn

    );



  });



}





// ======================================================

// GET PRODUCTS

// ======================================================



function getProducts() {



  const ss =

    getSpreadsheet();





  const sheet =

    ss.getSheetByName("Products");





  if (

    !sheet ||

    sheet.getLastRow() < 2

  ) {



    return [];



  }





  const data =

    sheet

      .getRange(

        2,

        1,

        sheet.getLastRow() - 1,

        7

      )

      .getValues();





  return data



    .filter(row => {



      return (

        row[5] === true ||

        String(row[5])

          .trim()

          .toUpperCase() === "TRUE"

      );



    })



    .map(row => ({



      id:

        String(row[0] || ""),



      name:

        String(row[1] || ""),



      category:

        String(row[2] || ""),



      unit:

        String(row[3] || ""),



      price:

        number\_(row[4]),



      inventoryType:

        String(

          row[6] || "STANDARD"

        )

          .trim()

          .toUpperCase()



    }));



}





// ======================================================

// GET INVENTORY PRODUCTS

// ======================================================



function getInventoryProducts() {



  const products =

    getProducts();





  return products.filter(product => {



    return [

      "MEAT",

      "TOKWA",

      "EGG",

      "DRINK"

    ,

        "PIECE"
      ].includes(

      product.inventoryType

    );



  });



}





// ======================================================

// GET SALES PRODUCTS

// ======================================================



function getSalesProducts() {



  const products =

    getProducts();





  return products.filter(product => {



    const category =

      String(product.category)

        .toLowerCase();





    return (

      product.price > 0 &&

      (

        category === "food" ||

        category === "drink"

      )

    );



  });



}





// ======================================================

// GET PREVIOUS / BEGINNING INVENTORY

// ======================================================



function getBeginningInventory() {



  const ss =

    getSpreadsheet();





  const sheet =

    ss.getSheetByName("Inventory");





  if (

    !sheet ||

    sheet.getLastRow() < 2

  ) {



    return {};



  }





  const values =

    sheet

      .getRange(

        2,

        1,

        sheet.getLastRow() - 1,

        20

      )

      .getValues();





  const latest = {};





  values.forEach(row => {



    const productId =

      String(row[2] || "");





    if (!productId) {

      return;

    }





    latest[productId] = {



      type:

        String(row[4] || ""),



      endingRaw:

        number\_(row[13]),



      endingLoose:

        number\_(row[14]),



      endingCooked:

        number\_(row[12])



    };



  });





  return latest;

}





// ======================================================

// SAVE INVENTORY

// ======================================================



function saveInventory(data) {



  if (!data) {

    throw new Error(

      "No inventory data received."

    );

  }





  if (!data.date) {

    throw new Error(

      "Please select a date."

    );

  }





  if (!data.staff1) {

    throw new Error(

      "Please enter Staff 1."

    );

  }





  if (

    !Array.isArray(data.items) ||

    data.items.length === 0

  ) {



    throw new Error(

      "No inventory items found."

    );



  }





  const ss =

    getSpreadsheet();





  const sheet =

    ss.getSheetByName("Inventory");





  if (!sheet) {



    throw new Error(

      "Inventory sheet does not exist. Run setupSystem first."

    );



  }





  const rows = [];





  data.items.forEach(item => {



    const type =

      String(

        item.inventoryType ||

        "STANDARD"

      )

        .trim()

        .toUpperCase();





    let beginningRaw = 0;

    let beginningLoose = 0;



    let delivery = 0;

    let deliveryConverted = 0;



    let outFreezer = 0;



    let beginningCooked = 0;

    let cookedToday = 0;

    let endingCooked = 0;



    let endingRaw = 0;

    let endingLoose = 0;



    let rawRemaining = 0;

    let soldUsed = 0;





    // ==================================================

    // MEAT

    //

    // Beginning Raw + Delivery - Out From Freezer

    //

    // Beginning Cooked + Cooked Today - Ending Cooked

    // ==================================================



    if (type === "MEAT") {



      beginningRaw =

        number\_(item.beginningRaw);



      delivery =

        number\_(item.delivery);



      deliveryConverted =

        delivery;



      outFreezer =

        number\_(item.outFreezer);



      beginningCooked =

        number\_(item.beginningCooked);



      cookedToday =

        number\_(item.cookedToday);



      endingCooked =

        number\_(item.endingCooked);





      rawRemaining =

        beginningRaw +

        delivery -

        outFreezer;





      endingRaw =

        rawRemaining;





      soldUsed =

        beginningCooked +

        cookedToday -

        endingCooked;



    }





    // ==================================================

    // TOKWA

    //

    // 1 plastic = 10 pcs

    //

    // Raw:

    // Beginning PCS + Delivery PCS - Out PCS

    //

    // Cooked:

    // Beginning grams + Cooked grams - Ending grams

    // ==================================================



    else if (type === "TOKWA") {



      beginningRaw =

        number\_(item.beginningRaw);



      delivery =

        number\_(item.delivery);



      deliveryConverted =

        delivery \* 10;



      outFreezer =

        number\_(item.outFreezer);



      beginningCooked =

        number\_(item.beginningCooked);



      cookedToday =

        number\_(item.cookedToday);



      endingCooked =

        number\_(item.endingCooked);





      rawRemaining =

        beginningRaw +

        deliveryConverted -

        outFreezer;





      endingRaw =

        rawRemaining;





      soldUsed =

        beginningCooked +

        cookedToday -

        endingCooked;



    }





    // ==================================================

    // EGG

    //

    // 1 tray = 30 pcs

    //

    // Beginning trays and loose pieces stay separate.

    // Ending trays and loose pieces stay separate.

    // ==================================================



    else if (type === "EGG") {



      beginningRaw =

        number\_(item.beginningRaw);



      beginningLoose =

        number\_(item.beginningLoose);



      delivery =

        number\_(item.delivery);



      deliveryConverted =

        delivery \* 30;



      endingRaw =

        number\_(item.endingRaw);



      endingLoose =

        number\_(item.endingLoose);





      const beginningTotal =

        (beginningRaw \* 30) +

        beginningLoose;





      const endingTotal =

        (endingRaw \* 30) +

        endingLoose;





      rawRemaining =

        endingTotal;





      soldUsed =

        beginningTotal +

        deliveryConverted -

        endingTotal;



    }





    // ==================================================

    // DRINKS

    //

    // 1 box = 24 pcs

    //

    // Beginning + Delivery PCS - Ending = Sold

    // ==================================================



    else if (type === "DRINK") {



      beginningRaw =

        number\_(item.beginningRaw);



      delivery =

        number\_(item.delivery);



      deliveryConverted =

        delivery \* 24;



      endingRaw =

        number\_(item.endingRaw);





      rawRemaining =

        endingRaw;





      soldUsed =

        beginningRaw +

        deliveryConverted -

        endingRaw;



    }





    // ==================================================
    // PIECE STOCKS — LUMPIA / KWEK KWEK
    //
    // Total / Used = Beginning PCS + Delivery PCS - Ending PCS
    // This is inventory usage only for now.
    // ==================================================

    else if (type === "PIECE") {

      beginningRaw = number_(item.beginningRaw);
      delivery = number_(item.delivery);
      deliveryConverted = delivery;
      endingRaw = number_(item.endingRaw);

      rawRemaining = endingRaw;

      soldUsed =
        beginningRaw +
        delivery -
        endingRaw;

    }


    // Prevent impossible negative sold/used results.

    if (soldUsed < 0) {



      throw new Error(

        item.name +

        ": Ending inventory is greater than available inventory. Please check the values."

      );



    }





    if (rawRemaining < 0) {



      throw new Error(

        item.name +

        ": Raw remaining inventory cannot be negative."

      );



    }





    // Egg loose pieces should be 0 to 29.

    if (

      type === "EGG" &&

      (

        beginningLoose < 0 ||

        beginningLoose > 29 ||

        endingLoose < 0 ||

        endingLoose > 29

      )

    ) {



      throw new Error(

        "Egg loose pieces must be between 0 and 29."

      );



    }





    rows.push([



      new Date(),



      data.date,



      item.id,



      item.name,



      type,



      beginningRaw,



      beginningLoose,



      delivery,



      deliveryConverted,



      outFreezer,



      beginningCooked,



      cookedToday,



      endingCooked,



      endingRaw,



      endingLoose,



      rawRemaining,



      soldUsed,



      data.staff1 || "",



      data.staff2 || "",



      data.staff3 || ""



    ]);



  });





  sheet

    .getRange(

      sheet.getLastRow() + 1,

      1,

      rows.length,

      20

    )

    .setValues(rows);





  return {

    success: true,

    message: "Inventory saved successfully."

  };



}





// ======================================================

// SAVE SALES REPORT

// ======================================================



function saveSalesReport(data) {



  if (!data) {

    throw new Error(

      "No sales data received."

    );

  }





  if (!data.date) {

    throw new Error(

      "Please select a date."

    );

  }





  if (!data.staff1) {

    throw new Error(

      "Please enter Staff 1."

    );

  }





  const ss =

    getSpreadsheet();





  const salesSheet =

    ss.getSheetByName("Sales");





  const reportSheet =

    ss.getSheetByName("Daily Reports");





  if (

    !salesSheet ||

    !reportSheet

  ) {



    throw new Error(

      "Please run setupSystem first."

    );



  }





  const rows = [];



  let grossSales = 0;





  (data.sales || []).forEach(item => {



    const gcash =

      number\_(item.gcash);



    const grab =

      number\_(item.grab);



    const price =

      number\_(item.price);



    const quantity =

      number\_(item.quantity);





    const amount =

      price \* quantity;





    grossSales += amount;





    if (

      quantity !== 0 ||

      gcash !== 0 ||

      grab !== 0

    ) {



      rows.push([



        new Date(),



        data.date,



        item.id,



        item.name,



        gcash,



        grab,



        price,



        quantity,



        amount



      ]);



    }



  });





  if (rows.length > 0) {



    salesSheet

      .getRange(

        salesSheet.getLastRow() + 1,

        1,

        rows.length,

        9

      )

      .setValues(rows);



  }





  const discount =

    number\_(data.discount);





  const expenses =

    number\_(data.expenses);





  const actualCount =

    number\_(data.actualCount);





  const netSales =

    grossSales -

    discount -

    expenses;





  const overShort =

    actualCount -

    netSales;





  reportSheet.appendRow([



    new Date(),



    data.date,



    data.staff1 || "",



    data.staff2 || "",



    data.staff3 || "",



    grossSales,



    discount,



    expenses,



    netSales,



    actualCount,



    overShort



  ]);





  return {



    success: true,



    message:

      "Daily sales report saved successfully.",



    grossSales:

      grossSales,



    netSales:

      netSales,



    overShort:

      overShort



  };



}





// ======================================================

// GET REPORTS

// ======================================================



function getReports() {



  const ss =

    getSpreadsheet();





  const sheet =

    ss.getSheetByName(

      "Daily Reports"

    );





  if (

    !sheet ||

    sheet.getLastRow() < 2

  ) {



    return [];



  }





  const data =

    sheet

      .getRange(

        2,

        1,

        sheet.getLastRow() - 1,

        11

      )

      .getValues();





  return data

    .reverse()

    .slice(0, 50)

    .map(row => ({



      date:

        formatDate\_(row[1]),



      staff1:

        String(row[2] || ""),



      staff2:

        String(row[3] || ""),



      staff3:

        String(row[4] || ""),



      gross:

        number\_(row[5]),



      discount:

        number\_(row[6]),



      expenses:

        number\_(row[7]),



      net:

        number\_(row[8]),



      actual:

        number\_(row[9]),



      overShort:

        number\_(row[10])



    }));



}





// ======================================================

// HELPERS

// ======================================================



function number\_(value) {



  const number =

    Number(value);





  return isNaN(number)

    ? 0

    : number;



}





function normalizeName\_(value) {



  return String(value || "")

    .trim()

    .toLowerCase()

    .replace(/\s+/g, " ");



}





function formatDate\_(value) {



  if (!value) {

    return "";

  }





  if (value instanceof Date) {



    return Utilities.formatDate(

      value,

      Session.getScriptTimeZone(),

      "yyyy-MM-dd"

    );



  }





  return String(value);



}