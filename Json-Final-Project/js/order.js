document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    const orderContainer = document.getElementById('order-container');
    const grandTotalElement = document.getElementById('grand-total');

    if (!orderContainer) {
        console.error('Order container not found!');
        return;
    }

    const calculateGrandTotal = (orders) => {
        return orders.reduce((total, order) => {
            const quantity = order.quantity || 1;
            const pricePerItem = parseFloat(order.price);
            return total + (pricePerItem * quantity);
        }, 0).toFixed(2);
    };

    const updateGrandTotal = async () => {
        try {
            const response = await fetch('http://localhost:3000/orders');
            const orders = await response.json();
            grandTotalElement.innerHTML = `Grand Total: $${calculateGrandTotal(orders)}`;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const orderMaker = (orders) => {
        orderContainer.innerHTML = '';

        orders.forEach(order => {
            const quantity = order.quantity || 1; // Ensure quantity is at least 1
            const pricePerItem = parseFloat(order.price);

            let orderImg = document.createElement("img");
            orderImg.src = order.image;
            orderImg.alt = order.name;
            orderImg.classList.add('order-img');

            let orderName = document.createElement("h3");
            orderName.innerHTML = order.name;

            let orderPrice = document.createElement("p");
            orderPrice.innerHTML = `Price: $<span class="price">${(pricePerItem * quantity).toFixed(2)}</span>`;
            orderPrice.setAttribute('data-price', pricePerItem);

            let orderQuantity = document.createElement("p");
            orderQuantity.innerHTML = `Quantity: <span class="quantity">${quantity}</span>`;

            let increaseBtn = document.createElement("button");
            increaseBtn.innerHTML = "+";
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
                    await fetch(`http://localhost:3000/orders/${id}`, {
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

            let decreaseBtn = document.createElement("button");
            decreaseBtn.innerHTML = "-";
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
                        await fetch(`http://localhost:3000/orders/${id}`, {
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
                        await fetch(`http://localhost:3000/orders/${id}`, {
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

            let removeBtn = document.createElement("button");
            removeBtn.innerHTML = "Remove";
            removeBtn.classList.add("remove-order", "btn", "btn-danger");
            removeBtn.setAttribute("data-id", order.id);

            removeBtn.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                const orderItemDiv = event.target.closest('.order-item');
                try {
                    await fetch(`http://localhost:3000/orders/${id}`, {
                        method: 'DELETE'
                    });
                    orderItemDiv.remove();
                    updateGrandTotal();
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            let orderDiv = document.createElement("div");
            orderDiv.classList.add('order-item');

            orderDiv.append(orderImg, orderName, orderPrice, orderQuantity, increaseBtn, decreaseBtn, removeBtn);
            orderContainer.append(orderDiv);
        });
    };

    try {
        const response = await fetch('http://localhost:3000/orders');
        const orders = await response.json();
        orderMaker(orders);
        grandTotalElement.innerHTML = `Grand Total: $${calculateGrandTotal(orders)}`;

        const checkoutButton = document.getElementById('checkout-button');
        checkoutButton.addEventListener('click', async () => {
            try {
                await fetch('http://localhost:3000/orders', {
                    method: 'DELETE'
                });
                alert('Your order is successfully done!');
                orderContainer.innerHTML = ''; // Clear the order container
                grandTotalElement.innerHTML = 'Grand Total: $0.00'; // Reset the grand total
            } catch (error) {
                console.error('Error:', error);
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }
});
