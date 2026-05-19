import {deletePostHandler, editPostHandler, showEditTextArea, postHandler} from "./modules/handlers.js"

// STARTUP
// Add event listeners to existing edit buttons to toggle the visibility of the edit textarea when clicked
document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", () => {
        const postId = button.id.split("-").pop()
        showEditTextArea(postId)
    })
})
// Add event listener to the post creation form to handle new post submissions without refreshing the page
postHandler()
/// Format sql timestamps to local time
document.querySelectorAll(".post-time").forEach(span => {
    const time = new Date(span.textContent + " UTC")
    span.textContent = time.toLocaleString()
})
// Add event listeners to existing delete and edit forms to handle post deletions and edits without refreshing the page
document.querySelectorAll(".delete-form").forEach(form => {
    deletePostHandler(form)
})
document.querySelectorAll(".edit-form").forEach(form => {
    editPostHandler(form)
})

// SEARCH
document.getElementById("search-input").addEventListener("keyup", (e) => {
    console.log("input: ", e.target.value)
    let re = new RegExp(e.target.value.replace(/\s+/g,""), "gi");
    console.log(re)
    document.getElementById("posts-container").querySelectorAll(".post-card").forEach(card => {
    if (card.querySelector(".card-title").textContent.replace(/\s+/g,"").match(re) || card.querySelector(".dyprintnewline").textContent.replace(/\s+/g,"").match(re)) {
        card.classList.remove("dhiddenarea")
    } 
    else {
        card.classList.add("dhiddenarea")}
    })
    if (document.getElementById("posts-container").querySelectorAll(".post-card:not(.dhiddenarea)").length === 0) {
        document.querySelector(".dmessage").textContent = "No posts match your search :("
    } else {
        document.querySelector(".dmessage").textContent = ""
    }
})
