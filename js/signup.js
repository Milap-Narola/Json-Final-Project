
import { createUser, isExists } from '../components/userapi.js';




const handleUser = async (e) => {
    e.preventDefault();


    let user = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,

    }
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("isLogin", true);

    // console.log(user)
    await createUser(user);
    await isExists(user);


}

document.getElementById('signUp').addEventListener('submit', handleUser);

