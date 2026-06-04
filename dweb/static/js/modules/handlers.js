import { createPostCard } from "./render.js"
export {emptyPostsHandler, deletePostHandler, editPostHandler, showEditTextArea, postHandler,
    loginHandler, registerHandler, logoutHandler
}

// EMPTY POSTS HANDLER
// Checks if there are any posts in the container and shows/hides the empty post message accordingly
//
function emptyPostsHandler() {
    const postContainer = document.getElementById("posts-container")
    const emptyPostMsg = document.getElementById("posts-message")
    emptyPostMsg.style.display = postContainer.children.length > 0 ? emptyPostMsg.textContent = "" : emptyPostMsg.textContent = "No posts yet! Go post something!"
}


// POST HANDLER
// Handles the submission of the post form, sends a POST request to the server, and updates the UI with the new post without refreshing the page
//
function postHandler() {
    emptyPostsHandler()
    document.getElementById("post-form").addEventListener("submit", async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const title = formData.get("title")
        const body = formData.get("description")
        const score = formData.get("score")
        const status = formData.get("watchingStatus")
        const type = formData.get("animeType")
        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({title: title, description: body, score: score, watchingStatus: status,
                animeType: type})
            })
            if (!response.ok) {
                throw new Error("Request failed")
            }
            const data = await response.json()
            document.getElementById("posts-container").appendChild(createPostCard(data.post))
        } catch (err) {
            console.error(err)
        }
        e.target.reset()
        emptyPostsHandler()
    })
}

// SHOW EDIT TEXTAREA
// Toggles the visibility of the edit textarea for a specific post when the edit button is clicked
//
function showEditTextArea(id) {
    const textarea = document.getElementById(`editpost-${id}`)
    textarea.classList.toggle("dhiddenarea");
    document.querySelectorAll(".edit-form").forEach(form => {
    if (form.id !== `editpost-${id}`) {
        form.classList.add("dhiddenarea")
    }})
}

// DELETE POST HANDLER
// Handles the submission of the delete form, sends a DELETE request to the server, and removes the post from the UI without refreshing the page
//
function deletePostHandler(form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const postId = form.id.split("-").pop()
        try {
            const response = await fetch(`/api/posts/${postId}`, {
            method: "DELETE"})
            if (!response.ok) {
                console.error("Request failed")
            } else {
                const postCard = document.getElementById(`post-${postId}`)
                if (postCard) {
                    postCard.remove()
                }
                emptyPostsHandler()
        }} catch (err) {
            console.error(err) 
        }
    })}



// EDIT POST HANDLER
// Handles the submission of the edit form, sends a PUT request to the server with the updated post data, and updates the post in the UI without refreshing the page
//
function editPostHandler(form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)

        const postId = form.id.split("-").pop()
        const body = formData.get(`editdesc-${postId}`).trim()
        const score = formData.get(`editscore-${postId}`)
        const animeType = formData.get(`editAnimeType-${postId}`)
        const watchingStatus = formData.get(`editWatchingStatus-${postId}`)

        const orgBody = document.getElementById(`post-${postId}-description`).textContent
        const orgScore = document.getElementById(`post-${postId}-score`).textContent.split("/")[0]
        const orgAnimeType = document.getElementById(`post-${postId}-animetype`).textContent
        const orgWatchingStatus = document.getElementById(`post-${postId}-watchingstatus`).textContent
        
        const message = document.getElementById(`editmessage-${postId}`)
        

        if (body == orgBody && score == orgScore && animeType == orgAnimeType && watchingStatus == orgWatchingStatus) {
            message.classList.remove("dhiddenarea")
            message.textContent = "No changes detected."
        } else {
            message.classList.add("dhiddenarea")
            message.textContent = ""
            try {
                const response = await fetch(`/api/posts/${postId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({description: body, score: score,
                    animeType: animeType, watchingStatus: watchingStatus})
                })
                if (!response.ok) {
                    throw new Error("Request failed")
                }
                document.getElementById(`post-${postId}-description`).textContent = body
                document.getElementById(`post-${postId}-score`).textContent = `${score}/10`
                document.getElementById(`post-${postId}-watchingstatus`).textContent = watchingStatus
                document.getElementById(`post-${postId}-animetype`).textContent = animeType
                showEditTextArea(postId)
            } catch (err) {
                console.error(err)
            }
        }
        })
}

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
    document.getElementById("register-form").addEventListener("submit", async (e) => {
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
    document.getElementById("login-form").addEventListener("submit", async (e) => {
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
    document.getElementById("logout-btn").addEventListener("click", async (e) => {
        const response = await fetch("/api/logout", {
            method: "POST",
        })
        window.location.href = 'auth/login';
    })
}
