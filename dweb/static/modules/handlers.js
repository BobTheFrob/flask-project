import { createPostCard } from "./render.js"
export {emptyPostsHandler, deletePostHandler, editPostHandler, showEditTextArea, postHandler}

function emptyPostsHandler() {
    const postContainer = document.getElementById("posts-container")
    const emptyPostMsg = postContainer.querySelector(".demptypost")
    emptyPostMsg.style.display = postContainer.children.length > 1 ? "none" : "block"
}
function postHandler() {
    emptyPostsHandler()
    document.getElementById("post-form").addEventListener("submit", async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const title = formData.get("title")
        const body = formData.get("description")
        const score = formData.get("score")
        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({title: title, description: body, score: score})
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

function showEditTextArea(id) {
    const textarea = document.getElementById(`editform-${id}`)
    textarea.classList.toggle("dhiddentextarea");
}

function deletePostHandler(form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const postId = form.action.split("/").pop()
        try {
            const response = await fetch(`/api/posts/${postId}`, {
            method: "DELETE"})
            if (!response.ok) {
                console.error("Request failed")
            } else {
                const data = await response.json()
                const postCard = document.getElementById(`post-${postId}`)
                if (postCard) {
                    postCard.remove()
                }
                emptyPostsHandler()
        }} catch (err) {
            console.error(err) 
        }
    })}

function editPostHandler(form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const postId = form.id.split("-").pop()
        const body = formData.get(`editdesc-${postId}`)
        const score = formData.get(`editscore-${postId}`)
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({description: body, score: score})
            })
            if (!response.ok) {
                throw new Error("Request failed")
            }
            const data = await response.json()
            document.getElementById(`post-${postId}`).querySelector(".card-text").textContent = body
            document.getElementById(`post-${postId}`).querySelector(".badge").textContent = `${score}/10`
            showEditTextArea(postId)
        } catch (err) {
            console.error(err)
        }
        })
}


