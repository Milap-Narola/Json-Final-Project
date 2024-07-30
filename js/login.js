
import { login } from "../components/userapi.js";


document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    let user =
    {
        username: document.getElementById('userName').value,
        password: document.getElementById('password').value
    };

  await login(user);

});

