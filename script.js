let products = JSON.parse(localStorage.getItem("products")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("sales", JSON.stringify(sales));
}

function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.style.display = "none");
  document.getElementById(tabId).style.display = "block";
  if(tabId === "products") renderProducts();
  if(tabId === "sales") renderSales();
  if(tabId === "profit") renderProfit();
}

// --- PRODUCTS ---
function addProduct() {
  let name = document.getElementById("productName").value;
  let units = parseInt(document.getElementById("productUnits").value);
  let cost = parseFloat(document.getElementById("productCost").value);

  if (!name || isNaN(units) || isNaN(cost)) {
    alert("Fill all product details!");
    return;
  }

  products.push({ name, units, cost });
  saveData();
  renderProducts();
}

function renderProducts() {
  let list = document.getElementById("productList");
  let select = document.getElementById("salesProduct");
  list.innerHTML = "";
  select.innerHTML = "";
  products.forEach((p, i) => {
    list.innerHTML += `<li>${p.name} - ${p.units} units (Cost: £${p.cost})</li>`;
    select.innerHTML += `<option value="${i}">${p.name}</option>`;
  });
}

// --- SALES ---
function addSale() {
  let productIndex = document.getElementById("salesProduct").value;
  let soldPrice = parseFloat(document.getElementById("soldPrice").value);
  let soldUnits = parseInt(document.getElementById("soldUnits").value);
  let platform = document.getElementById("platform").value;

  if (productIndex === "" || isNaN(soldPrice) || isNaN(soldUnits)) {
    alert("Fill all sales details!");
    return;
  }

  let product = products[productIndex];
  if (soldUnits > product.units) {
    alert("Not enough stock!");
    return;
  }

  product.units -= soldUnits;
  sales.push({ product: product.name, soldPrice, soldUnits, platform });
  saveData();
  renderSales();
}

function renderSales() {
  let table = document.getElementById("salesTable");
  table.innerHTML = `<tr>
    <th>Product</th><th>Units</th><th>Sold Price</th><th>Platform</th><th>Total</th>
  </tr>`;
  sales.forEach(s => {
    table.innerHTML += `<tr>
      <td>${s.product}</td>
      <td>${s.soldUnits}</td>
      <td>£${s.soldPrice}</td>
      <td>${s.platform}</td>
      <td>£${(s.soldPrice * s.soldUnits).toFixed(2)}</td>
    </tr>`;
  });
  renderProducts();
}

// --- PROFIT ---
function renderProfit() {
  let table = document.getElementById("profitTable");
  table.innerHTML = `<tr><th>Product</th><th>Revenue</th><th>Cost</th><th>Profit</th></tr>`;
  products.forEach(p => {
    let revenue = 0, cost = 0;
    sales.filter(s => s.product === p.name).forEach(s => {
      revenue += s.soldPrice * s.soldUnits;
      cost += p.cost * s.soldUnits;
    });
    table.innerHTML += `<tr>
      <td>${p.name}</td>
      <td>£${revenue.toFixed(2)}</td>
      <td>£${cost.toFixed(2)}</td>
      <td>£${(revenue - cost).toFixed(2)}</td>
    </tr>`;
  });
}

// --- EXPORT PDF & Excel ---
function downloadPDF() {
  alert("For PDF, we’ll integrate jsPDF library in next step!");
}

function downloadExcel() {
  let csv = "Product,Revenue,Cost,Profit\n";
  products.forEach(p => {
    let revenue = 0, cost = 0;
    sales.filter(s => s.product === p.name).forEach(s => {
      revenue += s.soldPrice * s.soldUnits;
      cost += p.cost * s.soldUnits;
    });
    csv += `${p.name},${revenue},${cost},${revenue - cost}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "profit_report.csv";
  link.click();
}
