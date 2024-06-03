// fetch('data.json', {

//     method: "POST",
//     headers: {
//          "Content-Type": "application/json"
//     },
// })
// .then((response) => response.json())
// .then((data) => {
//     const listImageElement =  document.getElementById("myButton");

//     listImageElement.innerHTML = data.data.items.map((item) => `
//       <div class="item" style="border: 1px solid blackk;">
//       <img src="${item.image}" style="width: 100%;">
//       <h4>${item.name}</h4>
//       <p>Price: ${item.price.toLocaleString()} vnd</p>
//       </div>

//     `)
//     .join("");
// });
(function () {
  let fetchedData = [];
  const listImageElement = document.getElementById("myButton");
  const listImageFormatHTMLElement = (itemData) => {
    return `
    <div data-type="${
      itemData.type
    }" class="item" style="border: 1px solid black;">
    <img src="${itemData.image}" style="width: 100%;">
    <h4>${itemData.name}</h4>
    <p>Giá: ${itemData.price.toLocaleString()} VND</p>
    </div>
`;
  };

  const fetchData = () => {
    fetch("data.json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data &&
          data.data &&
          data.data.items &&
          Array.isArray(data.data.items)
        ) {
          fetchedData = data.data.items;
          filterData("service", fetchedData);
        } else {
          listImageElement.innerHTML = "Không có dữ liệu.";
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        listImageElement.innerHTML = "Đã xảy ra lỗi khi tải dữ liệu.";
      });
  };

  const filterData = (producType, productData) => {
    const filterData = [];
    for (let i = 0; i < productData?.length; i++) {
      if (productData[i].type === producType) {
        filterData.push(listImageFormatHTMLElement(productData[i]));
      }
    }

    if (filterData.length) {
      listImageElement.innerHTML = filterData.join("");
    }
  };

  const getProductType = () => {
    const buttonsElement = document.getElementsByClassName("product-type__btn");
    let productType = null;

    for (let i = 0; i < buttonsElement.length; i++) {
      const button = buttonsElement[i];
      button.onclick = function () {
        if (button.classList.contains("active")) {
          return;
        }

        for (let j = 0; j < buttonsElement.length; j++) {
          buttonsElement[j].classList.remove("active");
        }

        productType = button.value;

        button.classList.add("active");
        filterData(productType, fetchedData);
      };
    }
  };

  fetchData();
  getProductType();
})();
