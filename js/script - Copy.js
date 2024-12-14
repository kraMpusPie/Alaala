// JavaScript to load navbar content
fetch('navbar.php')
.then(response => response.text())
.then(html => {
    document.getElementById('navbar-placeholder').innerHTML = html;
})
.catch(error => {
    console.error('Error loading navbar:', error);
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('products.php')
        .then(response => response.json())
        .then(data => {
            const { products, role } = data; // Destructure data from PHP
            renderProducts(products, role);
        })
        .catch(error => console.error('Error fetching products:', error));
});


const addProductBtn = document.getElementById('addProductBtn');
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        document.getElementById('addProductForm').reset();
        document.getElementById('productModal').style.display = 'flex';
    });
}
const productModal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const searchBox = document.getElementById('searchBox');
const productCardsContainer = document.getElementById('product-cards-container');

let products = [];
let currentEditIndex = null;

// Open Modal
addProductBtn.addEventListener('click', () => {
    currentEditIndex = null;
    document.getElementById('addProductForm').reset();
    imagePreviewContainer.innerHTML = '';
    productModal.style.display = 'flex';
    document.querySelector('.modal-header').textContent = 'Add Product';
});

// Close Modal
closeModalBtn.addEventListener('click', () => {
    productModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === productModal || event.target === document.getElementById('productDetailsModal')) {
        event.target.style.display = 'none';
    }
});

// Preview Images
imageInput.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);

    if (files.length + imagePreviewContainer.childElementCount > 5) {
        alert('You can only upload a total of 5 images.');
        imageInput.value = '';
        return;
    }

    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageWrapper = document.createElement('div');
            imageWrapper.classList.add('image-preview');
            const img = document.createElement('img');
            img.src = e.target.result;
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-btn');
            removeBtn.textContent = 'x';
            removeBtn.onclick = function () {
                imageWrapper.remove();
            };
            imageWrapper.appendChild(img);
            imageWrapper.appendChild(removeBtn);
            imagePreviewContainer.appendChild(imageWrapper);
        };
        reader.readAsDataURL(file);
    });
});

// Add Product
document.getElementById('addProductForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const productName = document.getElementById('productName').value;
    const productCategory = document.getElementById('productCategory').value;
    const productPrice = document.getElementById('productPrice').value;
    const productColor = document.getElementById('productColor').value;
    const productManufacturer = document.getElementById('productManufacturer').value;
    const productSize = document.getElementById('productSize').value;
    const productDescription = document.getElementById('productDescription').value;
    const productImages = Array.from(imagePreviewContainer.children).map(wrapper => wrapper.querySelector('img').src);

    if (productImages.length === 0) {
        alert('Please select one or more images.');
        return;
    }

    const newProduct = {
        name: productName,
        category: productCategory,
        price: productPrice,
        color: productColor,
        manufacturer: productManufacturer,
        size: productSize,
        description: productDescription,
        images: productImages,
    };

    if (currentEditIndex === null) {
        products.push(newProduct);
    } else {
        products[currentEditIndex] = newProduct;
    }

    renderProducts();

    productModal.style.display = 'none';
    imagePreviewContainer.innerHTML = '';
    imageInput.value = '';
});

    function updateCharacterCount() {
        const textarea = document.getElementById('productDescription');
        const charCount = document.getElementById('charCount');
        const remaining = 500 - textarea.value.length;
        charCount.textContent = remaining + ' characters remaining';
}

// Render Products
function renderProducts(productList = products, role = 'guest') {
    const productCardsContainer = document.getElementById('product-cards-container');
    productCardsContainer.innerHTML = ''; // Clear previous content

    productList.forEach((product, index) => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        // Product Image
        const img = document.createElement('img');
        img.src = product.images && product.images[0] ? product.images[0] : 'placeholder.png'; // Use first image or a placeholder
        img.alt = `${product.name} Thumbnail`;
        card.appendChild(img);

        // Product Name
        const h3 = document.createElement('h3');
        h3.textContent = product.name;
        card.appendChild(h3);

        // Product Category
        const pCategory = document.createElement('p');
        pCategory.textContent = `Category: ${product.category}`;
        card.appendChild(pCategory);

        // Product Price
        const pPrice = document.createElement('p');
        pPrice.classList.add('price');
        pPrice.textContent = `₱${product.price}`;
        card.appendChild(pPrice);

        // Buttons Container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons');

        // Details Button (Visible to All)
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.style.backgroundColor = 'DeepSkyBlue';
        detailsButton.style.color = 'white';
        detailsButton.classList.add('details-btn');
        detailsButton.addEventListener('click', () => {
            showProductDetails(index);
        });
        buttonsContainer.appendChild(detailsButton);

        // Add to Cart Button (Shown to All, Disabled for Guests)
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.style.backgroundColor = 'Orange';
        addToCartButton.style.color = 'white';
        addToCartButton.classList.add('add-to-cart-btn');
        
        if (role === 'guest') {
            addToCartButton.disabled = true; // Disable the button
            addToCartButton.title = "Log in to add products to your cart"; // Tooltip for guests
            addToCartButton.addEventListener('click', () => {
                alert('You need to log in to use the Add to Cart feature.');
            });
        } else {
            addToCartButton.addEventListener('click', () => {
                addToCart(product);
            });
        }
        buttonsContainer.appendChild(addToCartButton);

        // Edit and Delete Buttons (Admin Only)
        if (role === 'admin') {
            // Edit Button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.style.backgroundColor = 'LimeGreen';
            editButton.style.color = 'white';
            editButton.classList.add('edit-btn');
            editButton.addEventListener('click', () => {
                populateEditForm(product, index);
            });
            buttonsContainer.appendChild(editButton);

            // Delete Button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.backgroundColor = 'Crimson';
            deleteButton.style.color = 'white';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                deleteProduct(index);
            });
            buttonsContainer.appendChild(deleteButton);
        }

        card.appendChild(buttonsContainer);
        productCardsContainer.appendChild(card);
    });
}

function addToCart(product) {
    console.log(`${product.name} added to the cart.`);
}

function populateEditForm(product, index) {
    // Fill the form with product details for editing
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productColor').value = product.color;
    document.getElementById('productManufacturer').value = product.manufacturer;
    document.getElementById('productSize').value = product.size;
    document.getElementById('productDescription').value = product.description;

    // Handle image previews
    imagePreviewContainer.innerHTML = '';
    product.images.forEach(image => {
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-preview');
        const img = document.createElement('img');
        img.src = image;
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-btn');
        removeBtn.textContent = 'x';
        removeBtn.onclick = () => imageWrapper.remove();
        imageWrapper.appendChild(img);
        imageWrapper.appendChild(removeBtn);
        imagePreviewContainer.appendChild(imageWrapper);
    });

    productModal.style.display = 'flex';
    document.querySelector('.modal-header').textContent = 'Edit Product';
}

       // Search Filtering
    searchBox.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts); // Pass filtered list to render
});
// Add Product to Cart
function addToCart(product) {
    console.log(`${product.name} added to cart`);
}

// Delete Product
function deleteProduct(index) {
    products.splice(index, 1);
    renderProducts();
}
function editProduct(index) {
    console.log(`Edit Product at index ${index}`);
}

function showProductDetails(index) {
    const product = products[index]; // Fetch the product by index
    const mainCarousel = document.querySelector('.main-carousel');
    const thumbnailCarousel = document.querySelector('.thumbnail-carousel');
    const modal = document.getElementById('productDetailsModal');
    let currentSlideIndex = 0;

    // Validate required DOM elements
    if (!mainCarousel || !thumbnailCarousel || !modal) {
        console.error("Required DOM elements are missing!");
        return;
    }

    // Clear previous carousel content
    mainCarousel.innerHTML = '';
    thumbnailCarousel.innerHTML = '';

    // Populate the carousel with images
    if (product.images && product.images.length > 0) {
        product.images.forEach((image, idx) => {
            // Main Carousel Image
            const mainImage = document.createElement('img');
            mainImage.src = image;
            mainImage.style.display = idx === 0 ? 'block' : 'none'; // Show the first image
            mainCarousel.appendChild(mainImage);

            // Thumbnail Image
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.classList.toggle('active', idx === 0); // Highlight the first thumbnail
            thumbnail.addEventListener('click', () => setActiveSlide(idx));
            thumbnailCarousel.appendChild(thumbnail);
        });
    } else {
        // Placeholder if no images are available
        const placeholderImage = document.createElement('img');
        placeholderImage.src = 'placeholder.png'; // Path to a placeholder image
        placeholderImage.alt = 'No Image Available';
        mainCarousel.appendChild(placeholderImage);
    }

    // Helper function to switch slides
    function setActiveSlide(newIndex) {
        mainCarousel.querySelectorAll('img').forEach((img, idx) => {
            img.style.display = idx === newIndex ? 'block' : 'none';
        });
        thumbnailCarousel.querySelectorAll('img').forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === newIndex);
        });
        currentSlideIndex = newIndex;
    }

    // Handle next and previous buttons
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    if (nextBtn && prevBtn) {
        nextBtn.onclick = () => setActiveSlide((currentSlideIndex + 1) % product.images.length);
        prevBtn.onclick = () => setActiveSlide((currentSlideIndex - 1 + product.images.length) % product.images.length);
    }

    // Populate product details
    document.getElementById('productDetailName').textContent = product.name || 'No Name';
    document.getElementById('productDetailCategory').textContent = product.category || 'No Category';
    document.getElementById('productDetailPrice').textContent = product.price ? `₱${product.price}` : 'No Price';
    document.getElementById('productDetailColor').textContent = product.color || 'No Color';
    document.getElementById('productDetailManufacturer').textContent = product.manufacturer || 'No Manufacturer';
    document.getElementById('productDetailSize').textContent = product.size || 'No Size';
    document.getElementById('productDetailDescription').textContent = product.description || 'No Description';

    // Show the modal
    modal.style.display = 'flex';
}


document.addEventListener('DOMContentLoaded', () => {
    // Attach event listener to the close button
    const closeButton = document.querySelector('.product-details-modal .close-btn');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const modal = document.getElementById('productDetailsModal');
            modal.style.display = 'none'; // Hide the modal
            console.log('Close button clicked');
        });
    } else {
        console.error('Close button not found!');
    }

    // Optional: Close modal when clicking outside modal content
    const modal = document.getElementById('productDetailsModal');
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            console.log('Modal closed by clicking outside content');
        }
    });
});

// Close the Modal
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('productDetailsModal').style.display = 'none';
});


// Trigger Product Details Modal on "Details" Button Click
document.querySelectorAll('.product-card .details').forEach((button, index) => {
    button.addEventListener('click', () => {
        showProductDetails(index);
    });
});
