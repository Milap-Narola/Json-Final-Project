


export const isExists = async (user) => {
    let req = await fetch(``);
    let res = await req.json();

    if (res.length > 0) {
        return true;
    } else {
        return false;
    }
};

export const createUser = async (user) => {
    if (await isExists(user)) {
        alert("User already exists!");
        window.location.href ='/Final-Project/html/login.html';
    } else {
        await fetch(``, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        alert('User added successfully!');
        window.location.href = "/Final-Project/html/login.html";
    }
};

export const getUser = async () => {
    let req = await fetch(``);
    let res = await req.json();
    return res;
};
export const login = async (user) => {
    let req = await fetch(``);
    let res = await req.json();
    
    if (res.length == 0) {
        alert("User not found");
        window.location.href = '/Exam-2/html/signup.html';
    } else if (res.length == 1 && res[0].password == user.password) {
        alert("Logged in successfully");
        document.getElementById("navbar").innerHTML = navbar("logout", user.email)
        
        
        // localStorage.setItem("username", res[0].username); 
        window.location.href = "/Exam-2/html/index.html";
        
        localStorage.setItem("isLogin", true);
        // let user = JSON.parse(localStorage.getItem("user"));
    }
    else if (res.length == 1 && res[0].password != user.password) {
        alert("Password mismatch");

    }
    else {
        alert("Login failed");
        window.location.href = '/Exam-2/html/signup.html';
    }
};