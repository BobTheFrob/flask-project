export {logoutHandler}

async function authRequestHandler(response, messageElement) {
    const data = await response.json();
    const message = messageElement.querySelector(".card-text")
    messageElement.classList.remove("dhiddenarea")  

    if (response.status === 200) {
        window.location.href = '../posts';
    }
    else if (response.status === 201) {
        message.textContent = data.message
        message.classList = "card-text text-success"
    }
    else if (response.status === 400) {
        message.textContent = data.error
        message.classList = "card-text text-danger"
    }
    else if (response.status === 409) {
        message.textContent = data.error
        message.classList = "card-text text-warning"
    }
    else if (!response.ok) {
        message.textContent = data.error || "Something went wrong."
    }
}

// REGISTER HANDLER
// Handles the submission of the register form, sends a POST request to the server
//
function registerHandler() {
    const form = document.getElementById("register-form")
    if (!form) return

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const username = formData.get("register-username")
        const password = formData.get("register-password")
        const message = document.getElementById("dmessage")
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, password: password})
        })
        authRequestHandler(response, message)
        e.target.reset()
    })
}

// LOGIN HANDLER
// Handles the submission of the register form, sends a POST request to the server
//
function loginHandler() {
    const form = document.getElementById("login-form")
    if (!form) return

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const username = formData.get("login-username")
        const password = formData.get("login-password")
        const message = document.getElementById("dmessage")
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, password: password})
        })
        authRequestHandler(response, message)
        e.target.reset()
    })
}

// LOGOUT HANDLER
// Handles the logout button, sends a POST request to the server
//
function logoutHandler() {
    const logout = document.getElementById("logout-btn")
    if(!logout) return

    logout.addEventListener("click", async (e) => {
        const response = await fetch("/api/logout", {
            method: "POST",
        })
        window.location.href = 'auth/login';
    })
}

registerHandler()
loginHandler()