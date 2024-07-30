document.addEventListener('DOMContentLoaded', () => {
    const isLogin = localStorage.getItem('isLogin');
    if (!isLogin) {
        window.location.href = '/html/login.html';
    } else {
        const user = JSON.parse(localStorage.getItem('user'));
        updateNavbar("logout", user.username);
    }
});

const updateNavbar = (status, username) => {
    let navbarHTML;
    if (status === "logout") {
        navbarHTML = `
            <ul>
          <li><a class="nav-link scrollto" href="/index.html#home">Home</a></li>
          <li><a class="nav-link scrollto" href="/index.html#about">About</a></li>
          <li><a class="nav-link scrollto" href="/index.html#menu">Menu</a></li>
          <li><a class="nav-link scrollto" href="/index.html#events">Events</a></li>
          <li><a class="nav-link scrollto" href="/index.html#gallery">Gallery</a></li>
          <li><a class="nav-link scrollto" href="/index.html#contact">Contact</a></li>
          <li><a class="nav-link scrollto" href="/html/order.html">Your Order</a></li>
                <li><a class="nav-link" href="#" id="logout-link">Logout (${username})</a></li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle"></i>
        `;
    } else {
        navbarHTML = `
            <ul>
          <li><a class="nav-link scrollto" href="/index.html#home">Home</a></li>
          <li><a class="nav-link scrollto" href="/index.html#about">About</a></li>
          <li><a class="nav-link scrollto" href="/index.html#menu">Menu</a></li>
          <li><a class="nav-link scrollto" href="/index.html#events">Events</a></li>
          <li><a class="nav-link scrollto" href="/index.html#gallery">Gallery</a></li>
          <li><a class="nav-link scrollto" href="/index.html#contact">Contact</a></li>
          <li><a class="nav-link scrollto" href="/html/order.html">Your Order</a></li>
                <li><a class="nav-link scrollto" id="login-link" href="/html/login.html">Login</a></li>
                <li><a class="nav-link scrollto" id="signup-link" href="/html/signup.html">Signup</a></li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle"></i>
        `;
    }
    document.getElementById("navbar").innerHTML = navbarHTML;
};

document.getElementById('navbar').addEventListener('click', (event) => {
    if (event.target.id === 'logout-link') {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('user');
        window.location.href = '/html/login.html';
    }
});











document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    let orderContainer = document.getElementById('order-container');
    let grandTotal = document.getElementById('grand-total');
    let checkout = document.getElementById('checkOut');

    const calculateGrandTotal = (orders) => {
        return orders.reduce((total, order) => {
            const quantity = order.quantity || 1;
            const pricePerItem = parseFloat(order.price);
            return total + (pricePerItem * quantity);
        }, 0).toFixed(2);
    };

    const updateGrandTotal = async () => {
        try {
            const response = await fetch(`http://localhost:3000/cart`);
            const orders = await response.json();
            grandTotal.innerHTML = `Grand Total: $${calculateGrandTotal(orders)}`;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const renderCartItems = (orders) => {
        orderContainer.innerHTML = '';

        orders.forEach(order => {
            const quantity = order.quantity || 1;
            const pricePerItem = parseFloat(order.price);

            const orderDiv = document.createElement("div");
            orderDiv.classList.add('order-item');

            const orderImg = document.createElement("img");
            orderImg.src = order.image;
            orderImg.alt = order.name;
            orderImg.classList.add('order-img');

            const orderName = document.createElement("h3");
            orderName.textContent = order.name;

            const orderPrice = document.createElement("p");
            orderPrice.innerHTML = `Price: $<span class="price">${(pricePerItem * quantity).toFixed(2)}</span>`;
            orderPrice.setAttribute('data-price', pricePerItem);

            const orderQuantity = document.createElement("p");
            orderQuantity.innerHTML = `Quantity: <span class="quantity">${quantity}</span>`;

            const increaseBtn = document.createElement("button");
            increaseBtn.textContent = "+";
            increaseBtn.classList.add("increase-quantity", "btn", "btn-success");
            increaseBtn.setAttribute("data-id", order.id);

            increaseBtn.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                const orderItemDiv = event.target.closest('.order-item');
                const quantityElement = orderItemDiv.querySelector('.quantity');
                const priceElement = orderItemDiv.querySelector('.price');
                const originalPrice = parseFloat(orderPrice.getAttribute('data-price'));

                let quantity = parseInt(quantityElement.textContent);
                quantity += 1;
                quantityElement.textContent = quantity;
                priceElement.textContent = (originalPrice * quantity).toFixed(2);

                try {
                    await fetch(`http://localhost:3000/cart/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ quantity })
                    });
                    updateGrandTotal();
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            const decreaseBtn = document.createElement("button");
            decreaseBtn.textContent = "-";
            decreaseBtn.classList.add("decrease-quantity", "btn", "btn-warning");
            decreaseBtn.setAttribute("data-id", order.id);

            decreaseBtn.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                const orderItemDiv = event.target.closest('.order-item');
                const quantityElement = orderItemDiv.querySelector('.quantity');
                const priceElement = orderItemDiv.querySelector('.price');
                const originalPrice = parseFloat(orderPrice.getAttribute('data-price'));

                let quantity = parseInt(quantityElement.textContent);
                quantity -= 1;
                if (quantity <= 0) {
                    try {
                        await fetch(`http://localhost:3000/cart/${id}`, {
                            method: 'DELETE'
                        });
                        orderItemDiv.remove();
                        updateGrandTotal();
                    } catch (error) {
                        console.error('Error:', error);
                    }
                } else {
                    quantityElement.textContent = quantity;
                    priceElement.textContent = (originalPrice * quantity).toFixed(2);

                    try {
                        await fetch(`http://localhost:3000/cart/${id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ quantity })
                        });
                        updateGrandTotal();
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            });

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.classList.add("remove-order", "btn", "btn-danger");
            removeBtn.setAttribute("data-id", order.id);

            removeBtn.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                const orderItemDiv = event.target.closest('.order-item');
                try {
                    await fetch(`http://localhost:3000/cart/${id}`, {
                        method: 'DELETE'
                    });
                    orderItemDiv.remove();
                    updateGrandTotal();
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            orderDiv.append(orderImg, orderName, orderPrice, orderQuantity, increaseBtn, decreaseBtn, removeBtn);
            orderContainer.append(orderDiv);
        });
    };

    const fetchAndDisplayCart = async () => {
        try {
            const response = await fetch(`http://localhost:3000/cart`);
            const orders = await response.json();
            renderCartItems(orders);
            updateGrandTotal();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Event listener for checkout button
    checkout.addEventListener('click', async () => {
        try {
            await fetch(`http://localhost:3000/cart`, {
                method: 'DELETE'
            });
            alert('Your order is Done!');
            orderContainer.innerHTML = ''; // Clear the order container
            grandTotal.innerHTML = 'Grand Total: $0.00'; // Reset the grand total
        } catch (error) {
            console.error('Error:', error);
        }
    });

    fetchAndDisplayCart();
});
