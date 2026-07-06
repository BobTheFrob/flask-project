import { createPostCard, createTitleSearchThumbnails } from "./render.js"
export {
    getAllPostsHandler, deletePostHandler, editPostHandler, postHandler,
    showEditTextArea
}
import { jikanPostSearchHandler } from "./external-api-handlers.js";

// EMPTY POSTS HANDLER
// Checks if there are any posts in the container and shows/hides the empty post message accordingly
//
function emptyPostsHandler() {
    const postContainer = document.getElementById("posts-container")
    const emptyPostMsg = document.getElementById("posts-message")
    if (postContainer.children.length > 0) {
        emptyPostMsg.textContent = ""
        emptyPostMsg.style.display = "none"
    } else {
        emptyPostMsg.textContent = "No posts yet! Go post something!"
        emptyPostMsg.style.display = "block"
    }
}

// GET ALL POSTS HANDLER
// Gets and renders all posts in db
//
async function getAllPostsHandler() {
    const response = await fetch("/api/posts", {
        method: "GET"
    })
    const data = await response.json()
    for (let i in data) {
        document.getElementById("posts-container").appendChild(createPostCard(data[i]))
        const suggestionsBox = document.getElementById(`suggestions-${data[i].id}`)
        const editTitle = document.getElementById(`edittitle-${data[i].id}`)
        const formElement = document.getElementById(`editpost-${data[i].id}`)
        jikanPostSearchHandler(suggestionsBox, editTitle, formElement)
    }
    emptyPostsHandler()
}

// POST HANDLER
// Handles the submission of the post form, sends a POST request to the server, and updates the UI with the new post without refreshing the page
//
function postHandler() {
    document.getElementById("post-form").addEventListener("submit", async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const title = formData.get("title")
        const body = formData.get("description")
        const score = formData.get("score")
        const status = formData.get("watching_status")
        const type = formData.get("anime_type")
        const watch_link = formData.get("watch_link")
        const mal_id = e.target.dataset.malId
        const image_url = e.target.dataset.imgUrl
        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                title: title, description: body, score: score, 
                watching_status: status, anime_type: type, image_url: image_url, mal_id: mal_id,
                watch_link: watch_link
                })
            })
            if (!response.ok) {
                throw new Error("Request failed")
            }
            const data = await response.json()
            document.getElementById("posts-container").prepend(createPostCard(data.post))
            const suggestionsBox = document.getElementById(`suggestions-${data.post.id}`)
            const editTitle = document.getElementById(`edittitle-${data.post.id}`)
            const formElement = document.getElementById(`editpost-${data.post.id}`)
            jikanPostSearchHandler(suggestionsBox, editTitle, formElement)
            const form = document.getElementById("post-form")
            form.querySelector(".suggestion-selected").classList.add("dhiddenarea")
            form.dataset.malId = ""
            form.dataset.imgUrl = ""
            form.dataset.animeType = ""
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
// Handles the submission of the edit form, sends a PATCH request to the server with the updated post data, and updates the post in the UI without refreshing the page
//
function editPostHandler(form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)

        const postId = form.id.split("-").pop()
        const title = formData.get(`edittitle-${postId}`).trim()
        const body = formData.get(`editdesc-${postId}`).trim()
        const score = formData.get(`editscore-${postId}`)
        const anime_type = formData.get(`editanime_type-${postId}`)
        const watching_status = formData.get(`editwatching_status-${postId}`)
        const watch_link = formData.get(`editwatchlink-${postId}`)
        const mal_id = e.target.dataset.malId
        const image_url = e.target.dataset.imgUrl
        const message = document.getElementById(`editmessage-${postId}`)
        
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({title: title, description: body, score: score,
                anime_type: anime_type, watching_status: watching_status,
                mal_id: mal_id, image_url: image_url, watch_link: watch_link})
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            if (response.status === 200) {
                const data = await response.json()
                message.classList.add("dhiddenarea")
                message.textContent = ""
                document.getElementById(`post-${postId}-title`).textContent = data.post["title"]
                document.getElementById(`post-${postId}-description`).textContent = data.post["description"]
                document.getElementById(`post-${postId}-score`).textContent = `${score? String(score) + "/10" : ""}`
                document.getElementById(`post-${postId}-watching_status`).textContent = data.post["watching_status"]
                document.getElementById(`post-${postId}-anime_type`).textContent = data.post["anime_type"]
                document.getElementById(`postimg-${postId}`)? document.getElementById(`postimg-${postId}`).src = data.post["image_url"] : ""
                document.getElementById(`post-${postId}-watch_link`)? document.getElementById(`post-${postId}-watch_link`).href = data.post["watch_link"] : ""
                showEditTextArea(postId)
            } else if (response.status === 204) {
                message.classList.remove("dhiddenarea")
                message.textContent = "No changes detected."
            }
        } catch (err) {
            console.error(err)
        }
        // }
        })
}
