const containerInvoices = document.querySelector(".all-invoices");
const sendButton = document.querySelector(".save-send");
const addItemsBtn = document.querySelector(".add-new-item");
const itemsList = document.querySelector(".all-items");
const draftButton = document.querySelector(".save-draft");
const discardBtn = document.querySelector(".discard");
const invoiceQty = document.querySelector(".invoice-qty");
const filterBtn = document.querySelector(".filter");
const moonBtn = document.querySelector(".moon");
const sunBtn = document.querySelector(".sun");
const darkModeDiv = document.querySelector(".theme-image");

let count = 0;
let mainObj = [];
let itemsObjsArr = [];

showInvoice();

async function fetchData() {
  const response = await fetch(
    "https://invoiceapi-rpgn.onrender.com/api/invoices"
  );
  const data = await response.json();

  return data;
}

document
  .querySelector(".add-invoice-button")
  .addEventListener("click", function () {
    document
      .querySelector(".create-invoice")
      .classList.toggle("show-create-invoice");
    document.querySelector(".main-section").classList.toggle("fixed");
  });

document.querySelector(".go-back").addEventListener("click", function () {
  document
    .querySelector(".create-invoice")
    .classList.toggle("show-create-invoice");
  document.querySelector(".main-section").classList.toggle("fixed");
});

const draftInput = document.getElementById("draft");
const pendingInput = document.getElementById("pending");
const paidInput = document.getElementById("paid");

draftInput.addEventListener("input", showSelectedInvoice);
pendingInput.addEventListener("input", showSelectedInvoice);
paidInput.addEventListener("input", showSelectedInvoice);

function makeObj(status1) {
  mainObj.push({
    item_list: [],
    item_total_price: 0,

    status: status1,
    description: document.querySelector(".project-description").value,
    sender_username: "gaga",
    sender_email: `${randomId()}@gmail.com`,
    sender_country: document.querySelector(".from-country").value,
    sender_city: document.querySelector(".from-city").value,
    sender_street_address: document.querySelector(".from-adress").value,
    sender_postcode: document.querySelector(".from-post-code").value,

    reciever_username: document.querySelector(".client-name").value,
    reciever_email: document.querySelector(".email").value,
    reciever_country: document.querySelector(".country").value,
    reciever_city: document.querySelector(".city").value,
    reciever_street_address: document.querySelector(".adress").value,

    reciever_postcode: document.querySelector(".post-code").value,

    payment_terms: Number(document.querySelector(".payment-terms").value),
    payment_start_date: dateCorrection2(
      document.querySelector(".invoice-date").value
    ),
  });
}

function makeItemObj() {
  for (let i = 1; i <= count; i++) {
    if (document.querySelector(`.item-name${i}`)) {
      itemsObjsArr.push({
        name: document.querySelector(`.item-name${i}`).value,
        price: Number(document.querySelector(`.price${i}`).value),
        quantity: Number(document.querySelector(`.qty${i}`).value),

        total_price:
          Number(document.querySelector(`.qty${i}`).value) *
          Number(document.querySelector(`.price${i}`).value),
      });
    }
  }
}

function setItemsToMain() {
  if (mainObj.length > 0 && itemsObjsArr.length > 0) {
    mainObj[0].item_list = itemsObjsArr;
  }
  mainObj[0].item_total_price = mainObj[0].item_list.reduce(
    (acc, current) => acc + current.total_price,
    0
  );
}

async function showSelectedInvoice() {
  containerInvoices.innerHTML = "";
  const data = await fetchData();
  let selectedInvoicesArr = [];

  for (let i = 0; i < data.length; i++) {
    if (draftInput.checked && data[i].status == "draft") {
      selectedInvoicesArr.push(data[i]);
    } else if (pendingInput.checked && data[i].status == "pending") {
      selectedInvoicesArr.push(data[i]);
    } else if (paidInput.checked && data[i].status == "paid") {
      selectedInvoicesArr.push(data[i]);
    } else if (
      draftInput.checked == false &&
      pendingInput.checked == false &&
      paidInput.checked == false
    ) {
      selectedInvoicesArr.push(data[i]);
    }
  }

  for (let i = 0; i < selectedInvoicesArr.length; i++) {
    containerInvoices.innerHTML += `
    <div class="invoice-rectangle">
            <span class="hashtag"
              ><span class="text-style-1">#</span>${
                selectedInvoicesArr[i].id
              }</span
            >

            <p class="date">Due ${dateCorrection(
              selectedInvoicesArr[i].payment_end_date
            )} </p> 
            <span class="name">${
              selectedInvoicesArr[i].reciever_username
            }</span>
            <span class="amount">£ ${formatAmount(
              selectedInvoicesArr[i].item_total_price.toFixed(2)
            )}  </span>
            <div class="paid ${pendingTextColor(
              selectedInvoicesArr[i].status
            )}">
              <div class="opacity ${pendingColor(
                selectedInvoicesArr[i].status
              )} "></div>
              <div class="dot ${pendingDotColor(
                selectedInvoicesArr[i].status
              )}"></div>
              <p>${selectedInvoicesArr[i].status}</p>
            </div>
          </div>
      `;
  }
}

async function showInvoice() {
  containerInvoices.innerHTML = "";

  const data = await fetchData();

  for (let i = 0; i < data.length; i++) {
    containerInvoices.innerHTML += `
      <div class="invoice-rectangle">
            <span class="hashtag"
              ><span class="text-style-1">#</span>${randomId()}</span
            >

            <p class="date">Due ${dateCorrection(
              data[i].payment_end_date
            )} </p> 
            <span class="name">${data[i].reciever_username}</span>
            <span class="amount">£ ${formatAmount(
              data[i].item_total_price.toFixed(2)
            )}  </span>
            <div class="paid ${pendingTextColor(data[i].status)}">
              <div class="opacity ${pendingColor(data[i].status)} "></div>
              <div class="dot ${pendingDotColor(data[i].status)}"></div>
              <p>${data[i].status}</p>
            </div>
          </div>
      `;
  }

  invoiceQty.textContent = data.length;
  if (data.length == 0) {
    document.querySelector(".empty-div").classList.add("display-empty");
    document.querySelector(".all-invoices").classList.add("hide");
    document.querySelector(".invoice-qty").textContent = "No";
    const textsArr = [...document.getElementsByClassName("invoice-qty-text")];
    textsArr[0].textContent = "";
    textsArr[1].textContent = "";
  }
}

function formatAmount(number) {
  const formattedNumber = parseFloat(number).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formattedNumber;
}

function dateCorrection(date) {
  let splited = date.split("-");
  let month = splited[1];

  // prettier-ignore
  const months = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    '10': "Oct",
    '11': "Nov",
    '12': "Dec",
  };
  return `${splited[2]} ${months[month]} ${splited[0]}`;
}

function dateCorrection2(date) {
  let splited = date.split(" ");

  const months = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  let monthExist = false;

  if (splited[1]) {
    monthExist = Object.keys(months).some(
      (value) => value == splited[1].toLowerCase()
    );
  }

  if (splited[0] > 0 && splited[0] < 32 && monthExist && splited[2] > 2000) {
    return `${splited[2]}-${months[splited[1].toLowerCase()]}-${splited[0]}`;
  } else {
    return "";
  }
}

function pendingColor(status) {
  if (status === "pending") {
    return "pending-color";
  } else if (status === "draft") {
    return "draft-color";
  } else {
    return "";
  }
}
function pendingTextColor(status) {
  if (status === "pending") {
    return "pending-text";
  } else if (status === "draft") {
    return "draft-text";
  } else {
    return "";
  }
}
function pendingDotColor(status) {
  if (status === "pending") {
    return "pending-color";
  } else if (status === "draft") {
    return "draft-color";
  } else {
    return "";
  }
}

function calculatePaymentDue(createdAt, paymentTerms) {
  let splited = createdAt.split(" ");

  console.log(paymentTerms);

  const months = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  let monthExist = false;

  if (splited[1]) {
    monthExist = Object.keys(months).some(
      (value) => value == splited[1].toLowerCase()
    );
  }

  if (splited[0] > 0 && splited[0] < 32 && monthExist && splited[2] > 2000) {
    //chatgpt
    let date = new Date(createdAt);
    date.setDate(date.getDate() + Number(paymentTerms) + 1);

    let result = date.toISOString().split("T")[0];

    return result;
  } else {
    return "";
  }
}

function randomId() {
  //chatGTP
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter1 = letters[Math.floor(Math.random() * letters.length)];
  const randomLetter2 = letters[Math.floor(Math.random() * letters.length)];
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return `${randomLetter1}${randomLetter2}${randomNumbers}`;
}

function countTotal(i) {
  let qty = document.querySelector(`.qty${i}`).value;
  let price = document.querySelector(`.price${i}`).value;
  let total = document.querySelector(`.total-amount${i}`);

  if (qty.length > 0 && price.length > 0) {
    total.textContent = (Number(qty) * Number(price)).toFixed(2);
  } else if (qty.length > 0 && price.length == 0) {
    document.querySelector(`.price${i}`).classList.add("border-red");
  } else if (qty.length == 0 && price.length > 0) {
    document.querySelector(`.qty${i}`).classList.add("border-red");
  } else {
    total.textContent = "0.00";
  }
  if (price.length > 0 || (price.length == 0 && qty.length == 0)) {
    document.querySelector(`.price${i}`).classList.remove("border-red");
  }
  if (qty.length > 0 || (qty.length == 0 && price.length == 0)) {
    document.querySelector(`.qty${i}`).classList.remove("border-red");
  }
}

function removeItem(i) {
  const allItems = document.querySelector(".all-items");
  const item = document.querySelector(`.item${i}`);
  if (item) {
    allItems.removeChild(item);
  }
}

function addItems() {
  count++;

  const container = document.createElement("div");
  container.classList.add(`item-list-rectangle`, `item${count}`);
  itemsList.appendChild(container);

  const itemNameLabel = document.createElement("label");
  itemNameLabel.classList.add("item-name-label");
  const itemNameDescription = document.createElement("span");
  itemNameDescription.classList.add("description-item-name");
  itemNameDescription.textContent = "Item Name";
  const itemNameInput = document.createElement("input");
  itemNameInput.classList.add("input", `item-name${count}`);
  itemNameInput.type = "text";
  itemNameLabel.appendChild(itemNameDescription);
  itemNameLabel.appendChild(itemNameInput);
  container.appendChild(itemNameLabel);

  const qtyLabel = document.createElement("label");
  qtyLabel.classList.add("qty-label");
  const qtyDescription = document.createElement("span");
  qtyDescription.classList.add("description-qty");
  qtyDescription.textContent = "Qty.";
  const qtyInput = document.createElement("input");
  qtyInput.classList.add("input", `qty${count}`);
  qtyInput.type = "text";
  qtyLabel.appendChild(qtyDescription);
  qtyLabel.appendChild(qtyInput);
  container.appendChild(qtyLabel);

  const priceLabel = document.createElement("label");
  priceLabel.classList.add("price-label");
  const priceDescription = document.createElement("span");
  priceDescription.classList.add("description-price");
  priceDescription.textContent = "Price";
  const priceInput = document.createElement("input");
  priceInput.classList.add("input", `price${count}`);
  priceInput.type = "text";
  priceInput.placeholder = "0.00";
  priceLabel.appendChild(priceDescription);
  priceLabel.appendChild(priceInput);
  container.appendChild(priceLabel);

  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total");
  const totalDescription = document.createElement("span");
  totalDescription.classList.add(`total-description`);
  totalDescription.textContent = "Total";
  const totalRecycleDiv = document.createElement("div");
  totalRecycleDiv.classList.add("total-recycle");
  const totalAmountSpan = document.createElement("span");
  totalAmountSpan.classList.add(`total-amount${count}`);
  totalAmountSpan.textContent = "0.00";
  const recycleBtn = document.createElement("img");
  recycleBtn.classList.add(`recycleBtn${count}`, "recycle");
  recycleBtn.src = "./assets/icon-delete.svg";
  recycleBtn.alt = "recycle bin icon";

  totalDiv.appendChild(totalDescription);
  totalRecycleDiv.appendChild(totalAmountSpan);
  totalRecycleDiv.appendChild(recycleBtn);
  totalDiv.appendChild(totalRecycleDiv);
  container.appendChild(totalDiv);

  for (let i = 1; i <= count; i++) {
    let qty = document.querySelector(`.qty${i}`);
    let price = document.querySelector(`.price${i}`);
    let recycleBtn = document.querySelector(`.recycleBtn${i}`);

    if (qty != null && price != null && recycleBtn != null) {
      qty.addEventListener("input", () => {
        countTotal(i);
      });
      price.addEventListener("input", () => {
        countTotal(i);
      });

      recycleBtn.addEventListener("click", () => {
        removeItem(i);
      });
    }
  }
}

function pending() {
  let status = "pending";
  if (inputValidation()) {
    makeObj(status);
    makeItemObj();
    setItemsToMain();

    sendToBack();
    resetInput();
  }
}

function draft() {
  let status = "draft";
  if (inputValidation()) {
    makeObj(status);
    makeItemObj();
    setItemsToMain();
    sendToBack();
    console.log(mainObj[0]);
    resetInput();
  }
}

function resetInput() {
  const inputs = [...document.getElementsByTagName("input")];
  const textInputs = inputs.filter((input) => input.type === "text");

  textInputs.forEach((input) => (input.value = ""));
  mainObj.length = 0;
  itemsObjsArr = [];
  itemsList.innerHTML = "";

  showAlertText = false;
  document
    .querySelector(".create-invoice")
    .classList.toggle("show-create-invoice");
  document.querySelector(".main-section").classList.toggle("fixed");
  if (document.querySelector(".alert-text")) {
    document
      .querySelector(".new-invoice-section")
      .removeChild(document.querySelector(".alert-text"));
  }
}

let rotated = false;

sendButton.addEventListener("click", pending);
draftButton.addEventListener("click", draft);
addItemsBtn.addEventListener("click", addItems);
discardBtn.addEventListener("click", resetInput);

filterBtn.addEventListener("click", () => {
  document.querySelector(".sort-status").classList.toggle("show-status-bar");
  let arrowImg = document.querySelector(".arrow-down");

  if (rotated == false) {
    arrowImg.style.transform = "rotate(180deg)";
  } else {
    arrowImg.style.transform = "rotate(0deg)";
  }

  rotated = !rotated;
});

async function sendToBack() {
  try {
    const response = await fetch(
      "https://invoiceapi-rpgn.onrender.com/api/invoices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mainObj[0]),
      }
    );
    const data = await response.json();
    console.log("Server response:", data);
    if (!response.ok) {
      throw new Error("Network response was not ok" + response.statusText);
    }
  } catch (error) {
    console.log(error.message);
  }
}

let darkMode = false;

darkModeDiv.addEventListener("click", () => {
  document.querySelector("body").classList.toggle("dark");
  if (darkMode == false) {
    moonBtn.style.display = "none";
    sunBtn.style.display = "block";
  } else {
    moonBtn.style.display = "block";
    sunBtn.style.display = "none";
  }
  darkMode = !darkMode;
});

function inputValidation() {
  const inputs = [...document.getElementsByTagName("input")];
  const textInputs = inputs.filter((input) => input.type === "text");

  let hasEmptyInput = textInputs.some((input) => {
    return input.value.length < 1;
  });

  if (hasEmptyInput) {
    if (showAlertText == false) {
      const alertText = document.createElement("p");
      alertText.textContent = "-All fields must be added";
      alertText.style.color = "#ec5757";
      alertText.classList.add("alert-text");
      document.querySelector(".new-invoice-section").appendChild(alertText);
      showAlertText = true;
    }
    return false;
  }
  return true;
}

let showAlertText = false;
