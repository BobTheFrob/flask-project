import {deletePostHandler, editPostHandler, showEditTextArea, postHandler} from "./modules/handlers.js"

document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", () => {
        const postId = button.id.split("-").pop()
        showEditTextArea(postId)
    })
})

postHandler()

document.querySelectorAll(".post-time").forEach(span => {
    const time = new Date(span.textContent + " UTC")
    span.textContent = time.toLocaleString()
})

document.querySelectorAll(".delete-form").forEach(form => {
    deletePostHandler(form)
})

document.querySelectorAll(".edit-form").forEach(form => {
    editPostHandler(form)
})

