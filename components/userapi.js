


// export const isExists = async (user) => {
//     let req = await fetch(``);
//     let res = await req.json();

//     if (res.length > 0) {
//         return true;
//     } else {
//         return false;
//     }
// };

// export const createUser = async (user) => {
//     if (await isExists(user)) {
//         alert("User already exists!");
//         window.location.href ='/html/login.html';
//     } else {
//         await fetch(``, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(user),
//         });
//         alert('User added successfully!');
//         window.location.href = "/html/login.html";
//     }
// };

// export const getUser = async () => {
//     let req = await fetch(``);
//     let res = await req.json();
//     return res;
// };
// export const login = async (user) => {
//     let req = await fetch(``);
//     let res = await req.json();

//     if (res.length == 0) {
//         alert("User not found");
//         window.location.href = '/html/signup.html';
//     } else if (res.length == 1 && res[0].password == user.password) {
//         alert("Logged in successfully");
//         document.getElementById("navbar").innerHTML = navbar("logout", user.email)


//         // localStorage.setItem("username", res[0].username); 
//         window.location.href = "/html/index.html";

//         localStorage.setItem("isLogin", true);
//         // let user = JSON.parse(localStorage.getItem("user"));
//     }
//     else if (res.length == 1 && res[0].password != user.password) {
//         alert("Password mismatch");

//     }
//     else {
//         alert("Login failed");
//         window.location.href = '/html/signup.html';
//     }
// };

const BASE_URL = "http://localhost:3000/user"; // Update this URL to match your JSON server's URL

export const isExists = async (user) => {
    let req = await fetch(`${BASE_URL}?email=${user.email}`);
    let res = await req.json();

    return res.length > 0;
};

export const createUser = async (user) => {
    if (await isExists(user)) {
        alert("User already exists!");
        window.location.href = '/html/login.html';
    } else {
        await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        alert('User added successfully!');
        window.location.href = "/html/login.html";
    }
};

export const getUser = async (email) => {
    let req = await fetch(`${BASE_URL}?email=${email}`);
    let res = await req.json();
    return res[0];
};

export const login = async (user) => {
    let req = await fetch(`${BASE_URL}?username=${user.username}`);
    let res = await req.json();

    if (res.length == 0) {
        alert("User not found");
        window.location.href = '/html/signup.html';
    }
    else if (res.length == 1 && res[0].password == user.password) {
        alert("Logged in successfully");
        localStorage.setItem("isLogin", true);
        localStorage.setItem("user", JSON.stringify(res[0]));
        window.location.href = "/index.html";
    }
    else if (res.length == 1 && res[0].password != user.password) {
   
        alert("Password mismatch");
    }


    else {
        alert("Login failed");
        window.location.href = '/html/signup.html';
    }
};
