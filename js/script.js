// Load navbar content dynamically
fetch('navbar.php')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar-placeholder').innerHTML = html;
    })
    .catch(error => {
        console.error('Error loading navbar:', error);
    });

document.addEventListener('DOMContentLoaded', () => {
    // Fetch products and roles from PHP
    fetch('products.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching data:', data.error);
                return;
            }

            const { products: productData, role } = data; // Destructure data
            console.log('Role received from server:', role); // Debugging
            products = productData; // Global variable for products
            renderProducts(products, role); // Render products dynamically

            // Show "Add Product" button if role is admin
            if (role === 'admin') {
                const addProductButton = document.createElement('button');
                addProductButton.textContent = 'Add Product';
                addProductButton.classList.add('add-product-btn');
                addProductButton.addEventListener('click', () => {
                    const productModal = document.getElementById('productModal');
                    productModal.style.display = 'flex'; // Open modal
                    resetForm();  // Reset the form when opening "Add Product"
                    document.querySelector('.modal-header').textContent = 'Add Product'; // Set the modal title
                });
                document.getElementById('addProductButtonPlaceholder').appendChild(addProductButton);
            }
        })
        .catch(error => console.error('Error fetching products:', error));
});

// Handle image preview when files are selected
document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    if (imageInput) {
        imageInput.addEventListener('change', (event) => {
            const files = Array.from(event.target.files); // Convert FileList to Array

            // Check if the number of selected files exceeds the limit of 5
            if (files.length + imagePreviewContainer.children.length > 5) {
                alert('You can only upload a total of 5 images.');
                imageInput.value = ''; // Reset file input to prevent further selection
                return;
            }

            // Create previews for selected images
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageWrapper = document.createElement('div');
                    imageWrapper.classList.add('image-preview'); // Apply styling class

                    const img = document.createElement('img');
                    img.src = e.target.result; // Set image source to base64

                    // Add remove button for each image preview
                    const removeBtn = document.createElement('button');
                    removeBtn.classList.add('remove-btn');
                    removeBtn.textContent = 'x';
                    removeBtn.onclick = function () {
                        imageWrapper.remove(); // Remove image preview on click
                    };

                    imageWrapper.appendChild(img);
                    imageWrapper.appendChild(removeBtn);
                    imagePreviewContainer.appendChild(imageWrapper); // Add image preview to container
                };
                reader.readAsDataURL(file); // Convert image to base64 data URL
            });
        });
    }
});

// Character counter update function
function updateCharacterCount() {
    const textarea = document.getElementById('productDescription');
    const charCount = document.getElementById('charCount');
    const remaining = 500 - textarea.value.length; // Calculate the remaining characters
    charCount.textContent = remaining + ' characters remaining'; // Update the text in the counter
}

// Modal handlers for add and edit product
const productModal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const addProductForm = document.getElementById('addProductForm');
const productCardsContainer = document.getElementById('product-cards-container');

let currentEditIndex = null; // Used to track the current product being edited

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        console.log('Close button clicked'); // Debugging log
        if (productModal) {
            productModal.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const productDetailsModal = document.getElementById('productDetailsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            console.log('Close button clicked'); // Debugging log
            productDetailsModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === productDetailsModal) {
            console.log('Clicked outside modal'); // Debugging log
            productDetailsModal.style.display = 'none';
        }
    });
});

// Add product form submission (Add or Edit)
addProductForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const productData = {
        product: document.getElementById('productName').value, // Changed from 'product' to 'name'
        category: document.getElementById('productCategory').value,
        price: document.getElementById('productPrice').value,
        color: document.getElementById('productColor').value,
        material: document.getElementById('productMaterial').value,
        manufacturer: document.getElementById('productManufacturer').value,
        size: document.getElementById('productSize').value,
        description: document.getElementById('productDescription').value,
        images: Array.from(imagePreviewContainer.children).map(wrapper => wrapper.querySelector('img').src),
    };

    // Validate required fields
    if (!productData.product || !productData.category || productData.images.length === 0) {
        alert('All fields are required, including at least one image.');
        return;
    }

    const action = currentEditIndex === null ? 'addProduct' : 'editProduct';
    fetch('products.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...productData }), // Pass action dynamically
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Product added successfully!');
                if (currentEditIndex === null) {
                    products.push(productData); // Add new product
                } else {
                    products[currentEditIndex] = productData; // Update existing product
                }
                renderProducts(products);
                productModal.style.display = 'none'; // Close modal
            } else {
                console.error(data.message);
                alert(data.message || 'An error occurred while adding the product.');
            }
        })
        .catch(error => {
            console.error('Error saving product:', error);
            alert('A network error occurred. Please try again.');
        });
});


// Open product details modal
function openProductDetailsModal(product) {
    const productDetailsModal = document.getElementById('productDetailsModal');
    document.getElementById('productDetailName').textContent = product.product;
    document.getElementById('productDetailCategory').textContent = product.category;
    document.getElementById('productDetailPrice').textContent = product.price;
    document.getElementById('productDetailColor').textContent = product.color;
    document.getElementById('productDetailMaterial').textContent = product.material;
    document.getElementById('productDetailManufacturer').textContent = product.manufacturer;
    document.getElementById('productDetailSize').textContent = product.size;
    document.getElementById('productDetailDescription').textContent = product.description;
    
    productDetailsModal.style.display = 'block'; // Show the modal

    // Close modal when "x" button is clicked
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        console.log('Close button inside details modal clicked'); // Debugging log
        productDetailsModal.style.display = 'none'; // Hide the modal
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target == productDetailsModal) {
            console.log('Clicked outside modal'); // Debugging log
            productDetailsModal.style.display = 'none'; // Hide the modal
        }
    });
}

function renderProducts(productList = products, role = 'guest') {
    productCardsContainer.innerHTML = ''; // Clear previous content

    productList.forEach((product, index) => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.setAttribute('data-id', product.id); // Add data-id attribute with the product id

        // Product Image
        const img = document.createElement('img');
        img.src = product.images[0] || 'placeholder.png';  // Default placeholder
        card.appendChild(img);

        // Product Name, Category, and Price
        const h3 = document.createElement('h3');
        h3.textContent = product.product;  // Accessing the correct product name
        card.appendChild(h3);

        const pCategory = document.createElement('p');
        pCategory.textContent = product.category;
        card.appendChild(pCategory);

        const pPrice = document.createElement('p');
        pPrice.classList.add('price');
        pPrice.textContent = `₱${product.price}`;
        card.appendChild(pPrice);

        // Buttons Container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons');

        // Details Button
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.addEventListener('click', () => showProductDetails(index));
        buttonsContainer.appendChild(detailsButton);

        // Add to Cart Button (Disabled for Guests)
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.disabled = role === 'guest'; // Disable for guests (logged-out users)
        addToCartButton.title = role === 'guest' ? "Log in to add products to your cart" : '';

        addToCartButton.addEventListener('click', () => {
            if (role === 'guest') {
                alert('You need to log in to use the Add to Cart feature.');
            } else {
                // Adding the product to the cart
                addToCart(product);
            }
        });
        buttonsContainer.appendChild(addToCartButton);

        let cart = []; // The cart array to store cart items

        // Function to save the cart to LocalStorage
        function saveCartToLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(cart)); // Save the cart to localStorage as a JSON string
}
        // Function to load the cart from LocalStorage
        function loadCartFromLocalStorage() {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
        cart = JSON.parse(savedCart); // Parse the cart JSON data into the cart array
    }
}
loadCartFromLocalStorage(); // Load cart on page load

        document.getElementById("checkoutButton").addEventListener("click", () => {
            console.log("Proceed to Checkout clicked!"); // Debugging line
            document.getElementById("cartModal").style.display = "none"; // Close cart modal if it's open
            document.getElementById("checkoutModal").style.display = "block"; // Show the checkout modal
        });
        

        // Admin Buttons (Edit/Delete)
        if (role === 'admin') {
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => openEditModal(product, index));  // Open the modal for editing
            buttonsContainer.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteProduct(index));  // Delete the product
            buttonsContainer.appendChild(deleteButton);
        }

        card.appendChild(buttonsContainer);
        productCardsContainer.appendChild(card);
    });
}
       
       // Open Edit modal and populate the form for editing an existing product
       function openEditModal(product, index) {
           currentEditIndex = index;
           document.getElementById('productName').value = product.product;
           document.getElementById('productCategory').value = product.category;
           document.getElementById('productPrice').value = product.price;
           document.getElementById('productColor').value = product.color;
           document.getElementById('productMaterial').value = product.material;
           document.getElementById('productManufacturer').value = product.manufacturer;
           document.getElementById('productSize').value = product.size;
           document.getElementById('productDescription').value = product.description;
       
           // Clear and repopulate the image preview container
           imagePreviewContainer.innerHTML = '';
           product.images.forEach(image => {
               const imageWrapper = document.createElement('div');
               imageWrapper.classList.add('image-preview');
               const img = document.createElement('img');
               img.src = image;
               imageWrapper.appendChild(img);
               imagePreviewContainer.appendChild(imageWrapper);
           });
       
           // Change modal title to "Edit Product"
           document.querySelector('.modal-header').textContent = 'Edit Product';
           productModal.style.display = 'flex';
       }
       
       // Reset the form when opening Add Product modal
       function resetForm() {
           document.getElementById('productName').value = '';
           document.getElementById('productCategory').value = '';
           document.getElementById('productPrice').value = '';
           document.getElementById('productColor').value = '';
           document.getElementById('productMaterial').value = '';
           document.getElementById('productManufacturer').value = '';
           document.getElementById('productSize').value = '';
           document.getElementById('productDescription').value = '';
           imagePreviewContainer.innerHTML = '';  // Clear the image preview container
       }
       
       function deleteProduct(index) {
        if (confirm('Are you sure you want to delete this product?')) {
            const productId = products[index].id; // Get the product's ID
    
            fetch('products.php', {
                method: 'POST', // Use POST to handle the DELETE action
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deleteProduct', id: productId }), // Send the product ID
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        products.splice(index, 1); // Remove the product from the local array
                        renderProducts(products); // Re-render the product cards
                        alert('Product deleted successfully!');
                    } else {
                        alert(data.message || 'Failed to delete product.');
                    }
                })
                .catch(error => console.error('Error deleting product:', error));
        }
    }
    
       
       // Product Details Modal
       function showProductDetails(index) {
           const product = products[index];
           const modal = document.getElementById('productDetailsModal');
           const mainCarousel = document.querySelector('.main-carousel');
           const thumbnailCarousel = document.querySelector('.thumbnail-carousel');
           let currentSlideIndex = 0;
       
           mainCarousel.innerHTML = '';
           thumbnailCarousel.innerHTML = '';
       
           product.images.forEach((image, idx) => {
               const mainImage = document.createElement('img');
               mainImage.src = image;
               mainImage.style.display = idx === 0 ? 'block' : 'none';
               mainCarousel.appendChild(mainImage);
       
               const thumbnail = document.createElement('img');
               thumbnail.src = image;
               thumbnail.classList.toggle('active', idx === 0);
               thumbnail.addEventListener('click', () => setActiveSlide(idx));
               thumbnailCarousel.appendChild(thumbnail);
           });
       
           function setActiveSlide(newIndex) {
               mainCarousel.querySelectorAll('img').forEach((img, idx) => {
                   img.style.display = idx === newIndex ? 'block' : 'none';
               });
               thumbnailCarousel.querySelectorAll('img').forEach((thumb, idx) => {
                   thumb.classList.toggle('active', idx === newIndex);
               });
               currentSlideIndex = newIndex;
           }
       
           document.querySelector('.next-btn').addEventListener('click', () => setActiveSlide((currentSlideIndex + 1) % product.images.length));
           document.querySelector('.prev-btn').addEventListener('click', () => setActiveSlide((currentSlideIndex - 1 + product.images.length) % product.images.length));
       
           document.getElementById('productDetailName').textContent = product.product;
           document.getElementById('productDetailCategory').textContent = product.category;
           document.getElementById('productDetailPrice').textContent = `₱${product.price}`;
           document.getElementById('productDetailColor').textContent = product.color;
           document.getElementById('productDetailMaterial').textContent = product.material;
           document.getElementById('productDetailManufacturer').textContent = product.manufacturer;
           document.getElementById('productDetailSize').textContent = product.size;
           document.getElementById('productDetailDescription').textContent = product.description;
       
           modal.style.display = 'flex';
       
       }

        document.querySelector('#closeModalBtn').removeEventListener('click', closeModal);
        document.querySelector('#closeModalBtn').addEventListener('click', closeModal);

        function closeModal(event) {
            event.stopPropagation();
            console.log('Close button clicked');
            productDetailsModal.style.display = 'none';
        }

        document.getElementById('checkoutForm').addEventListener('submit', (event) => {
            event.preventDefault();
        
            const customerName = document.getElementById('customerName').value;
            const customerAddress = document.getElementById('customerAddress').value;
            const paymentMethod = document.getElementById('paymentMethod').value;
        
            // Prepare the order data
            const orderData = {
                customerName,
                customerAddress,
                paymentMethod,
                cartItems: cart,
                total: calculateTotal() // Add total price here
            };
        
            // Send the order data to the server
            fetch('processOrder.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Order placed successfully!');
                    cart = []; // Clear the cart
                    updateCartModal(); // Update the cart view
                    document.getElementById('checkoutModal').style.display = 'none'; // Close checkout modal
                } else {
                    alert('Error placing order: ' + data.message);
                }
            })
            .catch(error => console.error('Error processing order:', error));
        });
        
        // Calculate total price of cart items
        function calculateTotal() {
            return cart.reduce((total, item) => total + item.price * item.quantity, 0);
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Cart button event listener
            const cartButton = document.getElementById('cartButton');
            if (cartButton) {
                cartButton.addEventListener('click', () => {
                    const cartModal = document.getElementById('cartModal');
                    if (cartModal) {
                        cartModal.style.display = 'block'; // Show the cart modal
                        console.log('Cart modal opened');
                    }
                });
            }
        
            // Close cart modal
            const closeCartModal = document.getElementById('closeCartModal');
            if (closeCartModal) {
                closeCartModal.addEventListener('click', () => {
                    const cartModal = document.getElementById('cartModal');
                    if (cartModal) {
                        cartModal.style.display = 'none'; // Hide the cart modal
                        console.log('Cart modal closed');
                    }
                });
            }
        
            // Add to Cart button logic
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productCard = event.target.closest('.product-card');
                    const productId = productCard.getAttribute('data-id');
                    const productName = productCard.querySelector('h3').textContent;
                    const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('₱', ''));
                    const productImage = productCard.querySelector('img').src;
        
                    const product = { id: productId, product: productName, price: productPrice, image: productImage, quantity: 1 };
        
                    addToCart(product); // Add product to cart
                });
            });
        
            // Function to update cart modal
            function updateCartModal() {
                const cartItemsContainer = document.getElementById('cartItemsContainer');
                cartItemsContainer.innerHTML = ''; // Clear existing items
        
                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = '<p>No products in your cart.</p>';
                    return;
                }
        
                cart.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('cart-item');
                    itemDiv.innerHTML = `
                        <img src="${item.image}" alt="${item.product}" width="50">
                        <span>${item.product}</span>
                        <span>₱${item.price}</span>
                        <span>Quantity: ${item.quantity}</span>
                        <button class="remove-btn" data-id="${item.id}">Remove</button>
                    `;
                    cartItemsContainer.appendChild(itemDiv);
                });
        
                // Attach event listeners to remove buttons
                document.querySelectorAll('.remove-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const productId = button.getAttribute('data-id');
                        removeFromCart(productId);
                    });
                });
            }
        
            // Function to remove item from cart
            function removeFromCart(productId) {
                cart = cart.filter(item => item.id !== productId);
                saveCartToLocalStorage();
                updateCartModal();
            }
        
            // Save the cart to LocalStorage
            function saveCartToLocalStorage() {
                localStorage.setItem('cart', JSON.stringify(cart));
            }
        
            // Load cart initially and update the modal
            updateCartModal();
        });
        