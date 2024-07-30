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
                <li><a class="nav-link scrollto active" href="#hero">Home</a></li>
                <li><a class="nav-link scrollto" href="#about">About</a></li>
                <li><a class="nav-link scrollto" href="#menu">Menu</a></li>
                <li><a class="nav-link scrollto" href="#events">Events</a></li>
                <li><a class="nav-link scrollto" href="#gallery">Gallery</a></li>
                <li><a class="nav-link scrollto" href="#contact">Contact</a></li>
                <li><a class="nav-link scrollto" href="/html/order.html">Your Order</a></li>
                <li><a class="nav-link" href="#" id="logout-link">Logout (${username})</a></li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle"></i>
        `;
    } else {
        navbarHTML = `
            <ul>
                <li><a class="nav-link scrollto active" href="#hero">Home</a></li>
                <li><a class="nav-link scrollto" href="#about">About</a></li>
                <li><a class="nav-link scrollto" href="#menu">Menu</a></li>
                <li><a class="nav-link scrollto" href="#events">Events</a></li>
                <li><a class="nav-link scrollto" href="#gallery">Gallery</a></li>
                <li><a class="nav-link scrollto" href="#contact">Contact</a></li>
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




document.getElementById('contacts').addEventListener('submit', async (e) => {
    e.preventDefault();
    let contactsData = {
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    console.log(contactsData);

        let response = await fetch('http://localhost:3000/ContactData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactsData)
        });
        alert('Your Query has been successfully sent');
        let result = await response.json();
        console.log(result);
    });


    document.getElementById('booking').addEventListener('submit', async (e) => {
        e.preventDefault();

        let bookData = {
            name: document.getElementById('book-name').value,
            email: document.getElementById('book-email').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            people: document.getElementById('people').value,
            message: document.getElementById('book-message').value
        };

        console.log(bookData);
        let response = await fetch('http://localhost:3000/bookTable', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        alert('Booking was successfully created')
        document.querySelector('.loading').style.display = 'none';

        if (response.ok) {
            let result = await response.json();
            console.log('Server response:', result);
        }
        else {
            alert('Failed to book table');
        }
    });


    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('select-item')) {
            const id = event.target.getAttribute('data-id');
            try {
                const response = await fetch(`http://localhost:3000/orders/${id}`);
                const item = await response.json();
                item.quantity = 1; // Default quantity
                await addToCart(item);
                window.location.href = '/html/order.html';
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });


    async function addToCart(item) {
        try {
            const response = await fetch(`http://localhost:3000/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            });
            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }
            await fetchAndDisplayCart();
        } catch (error) {
            console.error('Error:', error);
        }
    }
