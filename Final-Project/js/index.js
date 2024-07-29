document.getElementById('Contact-Form').addEventListener('submit',async (e) => {
    e.preventDefault();
    let contactData = {
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    console.log(contactData);

    document.querySelector('.sent-message').style.display = 'block';

    let response = await fetch('http://localhost:3000/ContactData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    });
    let result = await response.json();
    console.log(result);
});


document.getElementById('bookingForm').addEventListener('submit', async (e) => {
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

    document.querySelector('.loading').style.display = 'block';

    let response = await fetch('http://localhost:3000/bookTable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    });

    document.querySelector('.loading').style.display = 'none';

    if (response.ok) {
        let result = await response.json();
        console.log('Server response:', result);

        document.querySelector('.sent-message').style.display = 'block';
    } else {
        document.querySelector('.error-message').innerText = 'There was an error sending your booking request. Please try again.';
        document.querySelector('.error-message').style.display = 'block';
    }
});

document.querySelectorAll('.select-item').forEach(button => {
    button.addEventListener('click', async (event) => {
      const name = event.target.getAttribute('data-name');
      const price = parseFloat(event.target.getAttribute('data-price'));
      const image = event.target.getAttribute('data-image')|| '/assets/img/menu/schweppes-tonic.jpg';
  
      const orderItem = { name, price , image };
      try {
        await fetch('http://localhost:3000/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderItem)
        });
        window.location.href = '/Final-Project/html/order.html';
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });