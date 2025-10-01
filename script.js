var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");

cartIcon.addEventListener("click", () =>
  cartTab.classList.add("cart-tab-active")
);

closeBtn.addEventListener("click", () =>
  cartTab.classList.remove("cart-tab-active")
);

let productList = [];
let cartProduct = [];

const updateTotals = () => {
  let totalPrice = 0;
  let totalQuantity = 0;

  document.querySelectorAll(".item").forEach((item) => {
    const price = parseFloat(
      item.querySelector(".item-total").textContent.replace("$", "")
    );

    const quantity = parseInt(
      item.querySelector(".quantity-value").textContent
    );

    totalPrice += price;
    totalQuantity += quantity;
  });

  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;
};

const showCards = () => {
  productList.forEach((product) => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");

    orderCard.innerHTML = `
      <div class="card-image">
          <img src="${product.image}" />
      </div>
      <h4>${product.name}</h4>
      <h4 class="price">${product.price}</h4>
      <a href="#" class="btn card-btn">Add to cart</a>
    `;

    cardList.appendChild(orderCard);

    const cardBtn = orderCard.querySelector(".card-btn");

    cardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addTocart(product, orderCard);
    });
  });
};

const addTocart = (product, orderCard) => {
  const existingProduct = cartProduct.find((item) => item.id === product.id);
  if (existingProduct) {
    alert("Item already in your cart!");
    return;
  }
  cartProduct.push(product);

  let quantity = 1;
  let price = parseFloat(product.price.replace(`$`, ""));

  //  Cart me itme add kiya
  const cartItem = document.createElement("div");
  cartItem.classList.add("item");

  cartItem.innerHTML = `
    <div class="item-image">
        <img src="${product.image}" />
    </div>
    <div class="detail">
        <h4>${product.name}</h4>
        <h4 class="item-total">${product.price}</h4>
    </div>
    <div class="flex">
      <a href="#" class="quantity-btn minus"><i class="fa-solid fa-minus"></i></a>
      <h4 class="quantity-value">${quantity}</h4>
      <a href="#" class="quantity-btn plus"><i class="fa-solid fa-plus"></i></a>
    </div>
  `;
  cartList.appendChild(cartItem);
  updateTotals();

  // Card par Add to cart button hatakar quantity control lagaya
  const cardBtn = orderCard.querySelector(".card-btn");
  cardBtn.style.display = "none";

  const quantityControls = document.createElement("div");
  quantityControls.classList.add("flex", "card-quantity");
  quantityControls.innerHTML = `
    <a href="#" class="quantity-btn minus"><i class="fa-solid fa-minus"></i></a>
    <h4 class="quantity-value">${quantity}</h4>
    <a href="#" class="quantity-btn plus"><i class="fa-solid fa-plus"></i></a>
  `;
  orderCard.appendChild(quantityControls);

  // dono jagha ke  elements
  const cartPlus = cartItem.querySelector(".plus");
  const cartMinus = cartItem.querySelector(".minus");
  const cartQuantityValue = cartItem.querySelector(".quantity-value");
  const itemTotal = cartItem.querySelector(".item-total");

  const cardPlus = quantityControls.querySelector(".plus");
  const cardMinus = quantityControls.querySelector(".minus");
  const cardQuantityValue = quantityControls.querySelector(".quantity-value");

  const updateAll = () => {
    cartQuantityValue.textContent = quantity;
    cardQuantityValue.textContent = quantity;
    itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
    updateTotals();
  };

  const increase = () => {
    quantity++;
    updateAll();
  };

  const decrease = () => {
    if (quantity > 1) {
      quantity--;
      updateAll();
    } else {
      // jab quantity 0 ho jai
      cartItem.remove();
      cartProduct = cartProduct.filter((item) => item.id !== product.id);
      quantityControls.remove();
      cardBtn.style.display = "block";
      updateTotals();
    }
  };

  // Event Listeners dono jagha
  cartPlus.addEventListener("click", (e) => {
    e.preventDefault();
    increase();
  });
  cardPlus.addEventListener("click", (e) => {
    e.preventDefault();
    increase();
  });
  cartMinus.addEventListener("click", (e) => {
    e.preventDefault();
    decrease();
  });
  cardMinus.addEventListener("click", (e) => {
    e.preventDefault();
    decrease();
  });
};

const initApp = () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      productList = data;
      showCards();
    });
};
initApp();
