// Initialize cart from localStorage or as an empty array
let cart = JSON.parse(localStorage.getItem('sellosyaCart')) || [];

// Function to save the cart to localStorage
function saveCart() {
  localStorage.setItem('sellosyaCart', JSON.stringify(cart));
}

// Function to update the cart count badge in the navbar
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count-badge');
  if (cartCountElement) {
    cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

// Function to add a product to the cart
function addToCart(productId, productName, productPrice) {
  const price = parseFloat(productPrice);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, name: productName, price: price, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  // Optional: Show a notification (e.g., using a Bootstrap toast or a simple alert)
  // alert(`${productName} ha sido añadido al carrito.`);
  console.log(cart); // For debugging
}

// Function to display cart items in cart.html
function displayCart() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalElement = document.getElementById('cart-total');
  
  if (!cartItemsContainer || !cartTotalElement) {
      // Not on cart.html or elements are missing
      return;
  }

  cartItemsContainer.innerHTML = ''; // Clear previous items

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
    cartTotalElement.textContent = 'Total: $0.00';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    total += itemSubtotal;

    const itemElement = document.createElement('div');
    itemElement.classList.add('card', 'mb-3');
    itemElement.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div>
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">Precio: $${item.price.toFixed(2)}</p>
            <p class="card-text">Cantidad: ${item.quantity}</p>
            <p class="card-text">Subtotal: $${itemSubtotal.toFixed(2)}</p>
          </div>
          <div>
            <button class="btn btn-sm btn-danger remove-from-cart-btn" data-product-id="${item.id}">Eliminar</button>
          </div>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;

  // Add event listeners to "Eliminar" buttons for each item
  document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;
      removeFromCart(productId);
    });
  });
}

// Function to remove an item from the cart (or decrease quantity)
function removeFromCart(productId) {
  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity -= 1;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1); // Remove item if quantity is 0
    }
  }

  saveCart();
  updateCartCount();
  
  // If on cart.html, refresh the displayed cart
  if (document.getElementById('cart-items-container')) {
    displayCart();
  }
}

// Function to empty the entire cart
function emptyCart() {
  cart = [];
  saveCart();
  updateCartCount();

  // If on cart.html, refresh the displayed cart
  if (document.getElementById('cart-items-container')) {
    displayCart();
  }
}

// Event Listeners to run once the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
  // Update cart count on all pages
  updateCartCount();

  // Add event listeners for "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;
      const productName = event.target.dataset.productName;
      const productPrice = event.target.dataset.productPrice;
      addToCart(productId, productName, productPrice);
    });
  });

  // Specific to cart.html
  if (document.getElementById('cart-items-container')) {
    displayCart(); // Display cart items on cart page load

    const emptyCartButton = document.getElementById('empty-cart-btn');
    if (emptyCartButton) {
      emptyCartButton.addEventListener('click', emptyCart);
    }
  }
});
