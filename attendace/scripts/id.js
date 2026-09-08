const employeeKey = "attendanceEmployees";
const attendanceKey = "attendanceRecords";

let currentMode = "register";

let selectedEmployee = null;

let scanner = null;

let scannerRunning = false;

let scanLocked = false;


/* =========================
   GET ELEMENTS
========================= */

const registerTab =
    document.querySelector("#registerTab");

const attendanceTab =
    document.querySelector("#attendanceTab");

const registerSection =
    document.querySelector("#registerSection");

const attendanceSection =
    document.querySelector("#attendanceSection");


const scannerStatus =
    document.querySelector("#scannerStatus");

const startScannerBtn =
    document.querySelector("#startScannerBtn");

const stopScannerBtn =
    document.querySelector("#stopScannerBtn");


const barcodeInput =
    document.querySelector("#barcode");

const employeeIdInput =
    document.querySelector("#employeeId");

const employeeNameInput =
    document.querySelector("#employeeName");

const employeeForm =
    document.querySelector("#employeeForm");

const employeeMessage =
    document.querySelector("#employeeMessage");


const attendanceBarcodeInput =
    document.querySelector(
        "#attendanceBarcode"
    );

const findEmployeeBtn =
    document.querySelector(
        "#findEmployeeBtn"
    );


const employeeCard =
    document.querySelector(
        "#employeeCard"
    );

const displayBarcode =
    document.querySelector(
        "#displayBarcode"
    );

const displayEmployeeId =
    document.querySelector(
        "#displayEmployeeId"
    );

const displayEmployeeName =
    document.querySelector(
        "#displayEmployeeName"
    );


const inBtn =
    document.querySelector("#inBtn");

const outBtn =
    document.querySelector("#outBtn");

const attendanceMessage =
    document.querySelector(
        "#attendanceMessage"
    );


const employeeTableBody =
    document.querySelector(
        "#employeeTableBody"
    );

const attendanceTableBody =
    document.querySelector(
        "#attendanceTableBody"
    );

const clock =
    document.querySelector("#clock");


/* =========================
   EMPLOYEE STORAGE
========================= */

function getEmployees() {

    return JSON.parse(
        localStorage.getItem(
            employeeKey
        )
    ) || [];

}


function saveEmployees(employees) {

    localStorage.setItem(
        employeeKey,
        JSON.stringify(employees)
    );

}


/* =========================
   ATTENDANCE STORAGE
========================= */

function getAttendance() {

    return JSON.parse(
        localStorage.getItem(
            attendanceKey
        )
    ) || [];

}


function saveAttendance(records) {

    localStorage.setItem(
        attendanceKey,
        JSON.stringify(records)
    );

}


/* =========================
   MESSAGE
========================= */

function setMessage(
    element,
    text,
    type = "success"
) {

    element.textContent = text;

    element.className =
        `message ${type}`;

}


/* =========================
   SWITCH MODE
========================= */

function switchMode(mode) {

    currentMode = mode;

    selectedEmployee = null;

    employeeCard.classList.add(
        "hidden"
    );

    attendanceMessage.textContent = "";

    const registering =
        mode === "register";


    registerSection.classList.toggle(
        "hidden",
        !registering
    );

    attendanceSection.classList.toggle(
        "hidden",
        registering
    );


    registerTab.classList.toggle(
        "active",
        registering
    );

    attendanceTab.classList.toggle(
        "active",
        !registering
    );


    if (registering) {

        scannerStatus.textContent =
            "Scanner mode: Register employee barcode";

    } else {

        scannerStatus.textContent =
            "Scanner mode: Attendance check";

    }

}


/* =========================
   START BARCODE SCANNER
========================= */

async function startScanner() {

    if (scannerRunning) {
        return;
    }


    scannerStatus.textContent =
        "Opening camera...";


    try {

        scanner =
            new Html5Qrcode(
                "reader"
            );


        const config = {

            fps: 10,

            qrbox: {
                width: 280,
                height: 140
            },

            aspectRatio: 1.777,

            formatsToSupport: [

                Html5QrcodeSupportedFormats.CODE_128,

                Html5QrcodeSupportedFormats.CODE_39,

                Html5QrcodeSupportedFormats.EAN_13,

                Html5QrcodeSupportedFormats.EAN_8,

                Html5QrcodeSupportedFormats.UPC_A,

                Html5QrcodeSupportedFormats.UPC_E,

                Html5QrcodeSupportedFormats.QR_CODE

            ]

        };


        await scanner.start(

            {
                facingMode:
                    "environment"
            },

            config,

            handleScanSuccess,

            () => {}

        );


        scannerRunning = true;


        startScannerBtn.disabled =
            true;

        stopScannerBtn.disabled =
            false;


        scannerStatus.textContent =
            "Camera ready. Point it at a barcode.";

    }

    catch (error) {

        console.error(error);


        scannerStatus.textContent =
            "Camera could not start. Allow camera permission or use HTTPS.";

    }

}


/* =========================
   STOP SCANNER
========================= */

async function stopScanner() {

    if (
        !scanner ||
        !scannerRunning
    ) {

        return;

    }


    try {

        await scanner.stop();

        scanner.clear();

    }

    catch (error) {

        console.error(error);

    }


    scanner = null;

    scannerRunning = false;


    startScannerBtn.disabled =
        false;

    stopScannerBtn.disabled =
        true;


    scannerStatus.textContent =
        "Scanner stopped.";

}


/* =========================
   WHEN BARCODE DETECTED
========================= */

function handleScanSuccess(
    decodedText
) {

    /*
       Prevent scanner from reading
       the same barcode many times
       very quickly.
    */

    if (scanLocked) {
        return;
    }


    scanLocked = true;


    const code =
        decodedText.trim();


    /* REGISTER MODE */

    if (
        currentMode ===
        "register"
    ) {

        barcodeInput.value =
            code;


        setMessage(

            employeeMessage,

            `Barcode detected: ${code}`

        );

    }


    /* ATTENDANCE MODE */

    else {

        attendanceBarcodeInput.value =
            code;

        findEmployee(code);

    }


    setTimeout(() => {

        scanLocked = false;

    }, 1800);

}


/* =========================
   REGISTER EMPLOYEE
========================= */

employeeForm.addEventListener(

    "submit",

    function (event) {

        event.preventDefault();


        const barcode =
            barcodeInput
                .value
                .trim();


        const employeeId =
            employeeIdInput
                .value
                .trim();


        const name =
            employeeNameInput
                .value
                .trim();


        if (
            !barcode ||
            !employeeId ||
            !name
        ) {

            setMessage(

                employeeMessage,

                "Please complete barcode, employee ID, and employee name.",

                "error"

            );

            return;

        }


        const employees =
            getEmployees();


        /* CHECK BARCODE */

        const barcodeExists =
            employees.some(

                employee =>
                    employee.barcode ===
                    barcode

            );


        if (barcodeExists) {

            setMessage(

                employeeMessage,

                "That barcode is already registered.",

                "error"

            );

            return;

        }


        /* CHECK ID */

        const idExists =
            employees.some(

                employee =>
                    employee.employeeId
                        .toLowerCase() ===
                    employeeId
                        .toLowerCase()

            );


        if (idExists) {

            setMessage(

                employeeMessage,

                "That employee ID is already registered.",

                "error"

            );

            return;

        }


        employees.push({

            barcode:
                barcode,

            employeeId:
                employeeId,

            name:
                name

        });


        saveEmployees(
            employees
        );


        employeeForm.reset();


        setMessage(

            employeeMessage,

            `${name} was saved successfully.`

        );


        renderEmployees();

    }

);


/* =========================
   FIND EMPLOYEE
========================= */

function findEmployee(
    code =
    attendanceBarcodeInput
        .value
        .trim()
) {

    if (!code) {

        setMessage(

            attendanceMessage,

            "Scan or enter a barcode first.",

            "error"

        );


        employeeCard
            .classList
            .add("hidden");


        return;

    }


    const employees =
        getEmployees();


    const employee =
        employees.find(

            item =>
                item.barcode ===
                code

        );


    if (!employee) {

        selectedEmployee = null;


        employeeCard
            .classList
            .add("hidden");


        setMessage(

            attendanceMessage,

            `No employee found for barcode ${code}.`,

            "error"

        );


        return;

    }


    selectedEmployee =
        employee;


    displayBarcode.textContent =
        employee.barcode;


    displayEmployeeId.textContent =
        employee.employeeId;


    displayEmployeeName.textContent =
        employee.name;


    employeeCard
        .classList
        .remove("hidden");


    setMessage(

        attendanceMessage,

        "Employee found. Choose IN or OUT."

    );

}


/* =========================
   TODAY DATE
========================= */

function localDateKey(
    date = new Date()
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        `${year}-${month}-${day}`
    );

}


/* =========================
   TIME IN
========================= */

function timeIn() {

    if (!selectedEmployee) {

        return;

    }


    const records =
        getAttendance();


    /*
       Check if employee
       already has an open
       IN today.
    */

    const openRecord =
        records.find(

            record =>

                record.employeeId ===
                    selectedEmployee
                        .employeeId

                &&

                record.date ===
                    localDateKey()

                &&

                record.inTime

                &&

                !record.outTime

        );


    if (openRecord) {

        setMessage(

            attendanceMessage,

            `${selectedEmployee.name} is already checked IN.`,

            "error"

        );

        return;

    }


    const now =
        new Date();


    const newRecord = {

        recordId:
            Date.now(),

        barcode:
            selectedEmployee.barcode,

        employeeId:
            selectedEmployee
                .employeeId,

        name:
            selectedEmployee.name,

        date:
            localDateKey(now),

        inTime:
            now.toISOString(),

        outTime:
            null

    };


    records.push(
        newRecord
    );


    saveAttendance(
        records
    );


    setMessage(

        attendanceMessage,

        `${selectedEmployee.name} checked IN at ${now.toLocaleTimeString()}.`

    );


    renderAttendance();

    clearAttendanceSelection();

}


/* =========================
   TIME OUT
========================= */

function timeOut() {

    if (!selectedEmployee) {

        return;

    }


    const records =
        getAttendance();


    /*
       Find latest attendance
       with IN but no OUT.
    */

    const record =
        [...records]
            .reverse()
            .find(

                item =>

                    item.employeeId ===
                        selectedEmployee
                            .employeeId

                    &&

                    item.date ===
                        localDateKey()

                    &&

                    item.inTime

                    &&

                    !item.outTime

            );


    if (!record) {

        setMessage(

            attendanceMessage,

            `No IN record found for ${selectedEmployee.name} today.`,

            "error"

        );

        return;

    }


    const now =
        new Date();


    record.outTime =
        now.toISOString();


    saveAttendance(
        records
    );


    setMessage(

        attendanceMessage,

        `${selectedEmployee.name} checked OUT at ${now.toLocaleTimeString()}.`

    );


    renderAttendance();

    clearAttendanceSelection();

}


/* =========================
   CLEAR AFTER ATTENDANCE
========================= */

function clearAttendanceSelection() {

    selectedEmployee = null;


    attendanceBarcodeInput.value =
        "";


    employeeCard
        .classList
        .add("hidden");

}


/* =========================
   FORMAT TIME
========================= */

function formatDateTime(
    isoString
) {

    if (!isoString) {

        return "—";

    }


    return new Date(
        isoString
    ).toLocaleString(

        [],

        {

            year: "numeric",

            month: "short",

            day: "2-digit",

            hour: "2-digit",

            minute: "2-digit",

            second: "2-digit"

        }

    );

}


/* =========================
   DISPLAY EMPLOYEES
========================= */

function renderEmployees() {

    const employees =
        getEmployees();


    employeeTableBody.innerHTML =
        "";


    if (
        employees.length ===
        0
    ) {

        employeeTableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty">

                    No employees saved yet.

                </td>

            </tr>

        `;


        return;

    }


    employees.forEach(
        employee => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        employee.barcode
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        employee.employeeId
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        employee.name
                    )}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        data-id="${escapeHtml(
                            employee.employeeId
                        )}">

                        Delete

                    </button>

                </td>

            `;


            employeeTableBody
                .appendChild(row);

        }

    );

}


/* =========================
   DISPLAY ATTENDANCE
========================= */

function renderAttendance() {

    const today =
        localDateKey();


    const records =
        getAttendance()

            .filter(

                record =>
                    record.date ===
                    today

            )

            .reverse();


    attendanceTableBody.innerHTML =
        "";


    if (
        records.length ===
        0
    ) {

        attendanceTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty">

                    No attendance records today.

                </td>

            </tr>

        `;


        return;

    }


    records.forEach(
        record => {

            const row =
                document.createElement(
                    "tr"
                );


            let status =
                "IN";


            if (
                record.outTime
            ) {

                status =
                    "Completed";

            }


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        record.employeeId
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        record.name
                    )}
                </td>

                <td>
                    ${formatDateTime(
                        record.inTime
                    )}
                </td>

                <td>
                    ${formatDateTime(
                        record.outTime
                    )}
                </td>

                <td>
                    ${status}
                </td>

            `;


            attendanceTableBody
                .appendChild(row);

        }

    );

}


/* =========================
   DELETE EMPLOYEE
========================= */

employeeTableBody.addEventListener(

    "click",

    function (event) {

        const button =
            event.target.closest(
                ".delete-btn"
            );


        if (!button) {

            return;

        }


        const employeeId =
            button.dataset.id;


        const employees =
            getEmployees()
                .filter(

                    employee =>
                        employee
                            .employeeId !==
                        employeeId

                );


        saveEmployees(
            employees
        );


        renderEmployees();

    }

);


/* =========================
   SAFE HTML
========================= */

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            "\"",
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================
   BUTTON EVENTS
========================= */

registerTab.addEventListener(

    "click",

    () =>
        switchMode(
            "register"
        )

);


attendanceTab.addEventListener(

    "click",

    () =>
        switchMode(
            "attendance"
        )

);


startScannerBtn.addEventListener(

    "click",

    startScanner

);


stopScannerBtn.addEventListener(

    "click",

    stopScanner

);


findEmployeeBtn.addEventListener(

    "click",

    () =>
        findEmployee()

);


inBtn.addEventListener(

    "click",

    timeIn

);


outBtn.addEventListener(

    "click",

    timeOut

);


/* ENTER BARCODE */

attendanceBarcodeInput
    .addEventListener(

        "keydown",

        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                findEmployee();

            }

        }

    );


/* =========================
   LIVE CLOCK
========================= */

function updateClock() {

    clock.textContent =
        new Date()
            .toLocaleString();

}


setInterval(
    updateClock,
    1000
);


updateClock();


/* =========================
   INITIAL LOAD
========================= */

renderEmployees();

renderAttendance();

switchMode(
    "register"
);
