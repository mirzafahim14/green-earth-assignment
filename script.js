const categoryContainer = document.getElementById("category-container");
const plantContainer = document.getElementById("plant-container");
const spinner = document.getElementById("spinner");
const cartItems = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");
const modal = document.getElementById("plant-modal");
const modalContent = document.getElementById("modal-content");
const closeModalBtn = document.getElementById("close-modal");

let totalPrice = 0;

// spinner
function showSpinner() {
  spinner.classList.remove("hidden");
}

function hideSpinner() {
  spinner.classList.add("hidden");
}

// load all categories
async function loadCategories() {
  showSpinner();
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    displayCategories(data.categories);
  } catch (error) {
    console.log(error);
  } finally {
    hideSpinner();
  }
}

// display categories
function displayCategories(categories) {
  categoryContainer.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "category-btn active";
  allBtn.innerText = "All Plants";
  allBtn.addEventListener("click", () => {
    setActiveButton(allBtn);
    loadAllPlants();
  });
  categoryContainer.appendChild(allBtn);

  categories.forEach(category => {
    const button = document.createElement("button");
    button.className = "category-btn";
    button.innerText = category.category_name;

    button.addEventListener("click", () => {
      setActiveButton(button);
      loadPlantsByCategory(category.id);
    });

    categoryContainer.appendChild(button);
  });
}

// active button
function setActiveButton(activeBtn) {
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

// load all plants
async function loadAllPlants() {
  showSpinner();
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    displayPlants(data.plants);
  } catch (error) {
    console.log(error);
  } finally {
    hideSpinner();
  }
}

// load plants by category
async function loadPlantsByCategory(id) {
  showSpinner();
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await res.json();
    displayPlants(data.plants);
  } catch (error) {
    console.log(error);
  } finally {
    hideSpinner();
  }
}

// display plants
function displayPlants(plants) {
  plantContainer.innerHTML = "";

  plants.forEach(plant => {
    const card = document.createElement("div");
    card.className = "plant-card";

    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}">
      <div class="plant-card-content">
        <h3 class="plant-name" onclick="loadPlantDetails(${plant.id})">${plant.name}</h3>
        <p>${plant.description.slice(0, 70)}...</p>
        <p><strong>Category:</strong> ${plant.category}</p>
        <p><strong>Price:</strong> ৳${plant.price}</p>
        <button class="add-cart-btn">Add to Cart</button>
      </div>
    `;

    const addToCartBtn = card.querySelector(".add-cart-btn");
    addToCartBtn.addEventListener("click", () => addToCart(plant));

    plantContainer.appendChild(card);
  });
}

// load plant details
async function loadPlantDetails(id) {
  showSpinner();
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    const plant = data.plants;

    modalContent.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}">
      <h2>${plant.name}</h2>
      <p><strong>Category:</strong> ${plant.category}</p>
      <p><strong>Price:</strong> ৳${plant.price}</p>
      <p>${plant.description}</p>
    `;

    modal.showModal();
  } catch (error) {
    console.log(error);
  } finally {
    hideSpinner();
  }
}

closeModalBtn.addEventListener("click", () => {
  modal.close();
});

// cart
function addToCart(plant) {
  const item = document.createElement("div");
  item.className = "cart-item";

  item.innerHTML = `
    <span>${plant.name} - ৳${plant.price}</span>
    <button class="remove-btn">❌</button>
  `;

  const removeBtn = item.querySelector(".remove-btn");
  removeBtn.addEventListener("click", () => {
    totalPrice -= plant.price;
    totalPriceEl.innerText = totalPrice;
    item.remove();
  });

  cartItems.appendChild(item);

  totalPrice += plant.price;
  totalPriceEl.innerText = totalPrice;
}

// init
loadCategories();
loadAllPlants();