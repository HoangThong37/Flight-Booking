var pagination = document.getElementById("pagination");
let totalItems = 0;
let pageCount = 0;
let paginationLimit = 10;
let listItems = 0;

var pagesize = 9;
var currentType = "facility"; 

var body = {
  page: 0,
  data: {
    type: currentType,
  },
};


var paginationNumbers = document.getElementById("pagination-numbers");
var listImageElement = document.getElementById("list-image");

// start cart
let cart = [];
// const listImageElement = document.getElementById("list-image");
const quantityElement = document.getElementById("quantity");
const cartTableBody = document.querySelector("#cart-table tbody");
const totalPriceElement = document.getElementById("total-price");
let currentProduct = null;


function addToCart() {
    if (currentProduct) {
        const productId = currentProduct.id;
        if (cart[productId]) {
            cart[productId].quantity++;
        } else {
            cart[productId] = { ...currentProduct, quantity: 1 };
        }
        console.log("cart", cart.length);

        quantityElement.textContent = Object.keys(cart).length; 
        closePopup(); 
    }
}


function showCartPopup() {
    const cartPopup = document.getElementById("cart-popup");
    cartPopup.style.display = "block";

    renderCartTable();
}

function removeFromCart(index) {
    if (cart[index]) {
        cart[index].quantity--;
        if (cart[index].quantity === 0) {
            delete cart[index];
        }

        quantityElement.textContent = cart.length;
        renderCartTable();
    }
}


function renderCartTable() {
        // Xóa nội dung cũ của bảng giỏ hàng
        cartTableBody.innerHTML = "";
    
        let totalPrice = 0;
    
        for (const key in cart) {
            if (cart.hasOwnProperty(key)) {
                const item = cart[key];
                //console.log(localStorage.setItem("item", JSON.stringify(item)));
                const row = document.createElement("tr");
                const nameCell = document.createElement("td"); // name
                const priceCell = document.createElement("td"); // price
                const quantityCell = document.createElement("td"); // quantity
        
                const actionCell = document.createElement("td");
                const deleteButton = document.createElement("button"); // delete
        
                nameCell.textContent = item.name;
                row.appendChild(nameCell);
        
                priceCell.textContent = `${(item.price * item.quantity).toLocaleString()} VND`;
                row.appendChild(priceCell);
        
                quantityCell.textContent = item.quantity;
                row.appendChild(quantityCell);

                deleteButton.textContent = "Delete";
                deleteButton.onclick = () => removeFromCart(key);
                actionCell.appendChild(deleteButton);
                row.appendChild(actionCell);

                cartTableBody.appendChild(row);
        
                totalPrice += item.price * item.quantity;  //update price 
            }
        }
    
        totalPriceElement.textContent = `${totalPrice.toLocaleString()} VND`;
};



function closeCartPopup() {
    const cartPopup = document.getElementById("cart-popup");
    cartPopup.style.display = "none";
}
// End cart.


const getData = async (page = 0) => {
  const response = await fetch('data.json');
  const jsonData = await response.json();
  
  // Lọc dữ liệu theo type và phân trang
  const filteredData = jsonData.data.items.filter(item => item.type === body.data.type);
  const paginatedData = filteredData.slice(page * pagesize, (page + 1) * pagesize);

  return {
    items: paginatedData,
    total: filteredData.length,
  };
};

const renderView = async (page = 0) => {
  const data = await getData(page);
  listImageElement.innerHTML = data.items
    .map(
      (item) => `
    <div class="item" style="border: 1px solid black;" onclick="showPopup(${JSON.stringify(item).replace(/"/g, '&quot;')})">
    ${createProductHTML(item)}
    </div>
  `
    )
    .join("");

  const totalPage = Math.ceil(data.total / pagesize);
  paginationNumbers.innerHTML = [...Array(totalPage).keys()]
    .map((x) => `<div class="page-number" data-page="${x}">${x + 1}</div>`)
    .join("");

  const pageNumbers = document.querySelectorAll(".page-number");
  pageNumbers.forEach((pageNumber) => {
    pageNumber.addEventListener("click", () => {
      const page = parseInt(pageNumber.dataset.page);
      renderView(page);
    });
  });
};

// show html
function createProductHTML(item) {
    return `
      <img src="${item.image}" style="width: 100%;">
      <h4 style="padding-left: 5px;">${item.name}</h4>
      <p style="padding-left: 5px;">Price: ${item.price.toLocaleString()} VND</p>
    `;
  }

// show popup when clicked on img
function showPopup(item) {
  currentProduct = item;
  console.log("currentProduct", currentProduct);
  const popup = document.getElementById("popup");
  const popupImage = popup.querySelector(".popup-image");
  const popupName = popup.querySelector(".popup-name");
  const popupDescription = popup.querySelector(".popup-description");
  const popupPrice = popup.querySelector(".popup-price");

  popupImage.src = item.image;
  popupName.textContent = item.name;
  popupDescription.textContent = item.description;
  popupPrice.textContent = `${item.price.toLocaleString()} VND`;

  popup.style.display = "block";
}

// close the popup
function closePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "none";
}

// placeholder for addToCart
// function addToCart() {
//   alert("Item added to cart");
// }


// filter data and update when click button.
const filterData = (productType) => {
  body.data.type = productType;
  renderView(0); // Reset về trang đầu tiên khi lọc
};

// Khởi tạo sự kiện click cho các nút
const getProductType = () => {
  const buttonsElement = document.getElementsByClassName("product-type__btn");

  for (let i = 0; i < buttonsElement.length; i++) {
    const button = buttonsElement[i];

    button.onclick = function () {
      if (button.classList.contains("active")) {
        return;
      }

      for (let j = 0; j < buttonsElement.length; j++) {
        buttonsElement[j].classList.remove("active");
      }

      button.classList.add("active");
      filterData(button.value);
    };
  }
};

// Khởi tạo trang đầu tiên và sự kiện cho các nút
renderView();
getProductType();  


// filter image
let searchTimeout;

function handleSearch(searchValue) {
  clearTimeout(searchTimeout); // delete timeout trước 

  searchTimeout = setTimeout(() => {
    searchData(searchValue);
  }, 300);
}

async function searchData(searchValue) {
//   // Gửi yêu cầu API tìm kiếm dựa trên tên sản phẩm
//   const response = await fetch(`search-api-url?name=${searchValue}`);
//   const data = await response.json();

//   // Xử lý dữ liệu và cập nhật giao diện
//   renderSearchResults(data);

    const response = await fetch('data.json');
    const jsonData  = await response.json();

    // Xử lý dữ liệu và tìm kiếm sản phẩm dựa trên tên
    const data = jsonData.data && jsonData.data.items ? jsonData.data.items : [];

    const filteredData = data.filter(item => {
        return item.name.toLowerCase().includes(searchValue.toLowerCase());
    });

    renderSearchResults(filteredData);
}


function renderSearchResults(data) {
  const searchResultsElement = document.getElementById("list-image");
  searchResultsElement.innerHTML = "";

  data.forEach((item) => {
    const resultItem = document.createElement("div");

    resultItem.className = "item";
    resultItem.style.border = "1px solid black";
    resultItem.onclick = () => showPopup(item);

    resultItem.innerHTML = createProductHTML(item); 
    searchResultsElement.appendChild(resultItem);
  });
}


// submit 
function submitOrder() {
    var notification = document.getElementById("success-noti");
    notification.style.display = "block";
  
    var link = document.getElementById("order-detail-link");
    link.href = "order.html"; 
  }
  