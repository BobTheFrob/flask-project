export { createPostCard }
import { deletePostHandler, editPostHandler, showEditTextArea } from "./handlers.js";

function createPostCard(post) {
    const wrapper = document.createElement("div")
    wrapper.innerHTML = `
        <div class="col-lg-4 col-md-6 post-card" id="post-${post.id}">
            <div class="card bg-black text-light border-secondary">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h2 class="h4 card-title" id="post-${post.id}-title">${post.title}</h2>
                        <h4><span class="badge text-bg-secondary" id="post-${post.id}-score">${post.score}/10</span></h4>
                    </div>
                    <div class="d-flex justify-content-start gap-2 align-items-start mb-3">
                        <span class="badge text-bg-secondary text-capitalize fw-light" id="post-${post.id}-watchingstatus">${post['watchingStatus']}</span>
                        <span class="badge text-bg-secondary text-capitalize fw-light" id="post-${post.id}-animetype">${post['animeType']}</span>
                    </div>
                    <p class="card-text dyprintnewline" id="post-${post.id}-description">${post.description}</p>
                    <div class="d-flex align-items-center">
                        <p class="text-secondary small mb-3 post-meta">Post #${post.id} — </p>
                        <span class="text-secondary small mb-3 post-time">${new Date(post.created + " UTC").toLocaleString()}</span>
                    </div>
                    <div class="card-text container-fluid row g-2 center d-flex justify-content-center">
                        <button class="btn btn-outline-light btn-sm col-lg-8 edit-btn" id="editbtn-${post.id}">
                            Edit
                        </button>
                        <form class="col-lg-4 delete-form" id="deletepost-${post.id}">
                            <button class="btn btn-danger btn-sm" type="submit">
                                Delete
                            </button>
                        </form>
                    </div>
                    <form class="dhiddenarea mt-3 edit-form">
                        <div class="card-text container-fluid g-2 center d-flex justify-content-start align-items-center p-0">
                            <p class="text-secondary w-auto">
                                Score:
                            </p>
                            <input
                                id = "editscore-${post.id}" name="editscore-${post.id}" 
                                class="form-control mb-2 mx-2 w-auto edit-score"
                                type="number"
                                min="0"
                                max="10"
                                required>
                        </div>
                        <p class="text-secondary">Description: </p>
                        <textarea class="form-control mb-2 edit-desc" id="editdesc-${post.id}" name="editdesc-${post.id}" rows="4"></textarea>
                        <p class="text-warning small dhiddenarea" id="editmessage-${post.id}"></p>
                        <button class="btn btn-success btn-sm" type="submit">Confirm</button>
                    </form>
                </div>
            </div>
        </div>
    `


    // EDIT BUTTON
    const editBtn = wrapper.querySelector(".edit-btn")
    editBtn.addEventListener("click", () => { showEditTextArea(post.id) })

    // DELETE FORM
    const deleteForm = wrapper.querySelector(".delete-form")
    deletePostHandler(deleteForm)

    // EDIT FORM
    const editForm = wrapper.querySelector(".edit-form")

    editForm.id = `editpost-${post.id}`
    editPostHandler(editForm)

    // SCORE INPUT
    const scoreInput = wrapper.querySelector(".edit-score")
    scoreInput.value = post.score

    // TEXTAREA
    const textarea = wrapper.querySelector(".edit-desc")
    textarea.value = post.description

    return wrapper.firstElementChild
}