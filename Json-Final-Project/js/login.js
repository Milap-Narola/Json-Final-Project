
import { login } from "../components/userapi.js";


document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    let user =
    {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

  await login(user);

});
document.getElementById("navbar").innerHTML = navbar();
