export { createPostCard, createACVideoUpdates, createTitleSearchThumbnails }
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
                        <span class="badge text-bg-secondary text-capitalize fw-light" id="post-${post.id}-watching_status">${post['watching_status']}</span>
                        <span class="badge text-bg-secondary text-capitalize fw-light" id="post-${post.id}-anime_type">${post['anime_type']}</span>
                    </div>
                    <p class="card-text dyprintnewline" id="post-${post.id}-description">${post.description}</p>
                    <div class="d-flex align-items-center">
                        <p class="text-secondary small mb-3 post-meta">Post #${post.id} — </p>
                        <span class="text-secondary small mb-3 post-time">${new Date(post.created + " UTC").toLocaleString()}</span>
                    </div>
                    <div class="card-text d-flex justify-content-between gap-2">
                        <button class="btn btn-outline-light btn-sm flex-grow-1 edit-btn" id="editbtn-${post.id}">
                            Edit
                        </button>
                        <form class="m-0 delete-form" id="deletepost-${post.id}">
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
                        <div class="mt-3 row">
                            <div class="mb-3 col">
                                <label class="form-label" for="watching_status">Status</label>
                                <select class="form-select" name="editwatching_status-${post['id']}" id="editwatching_status-${post['id']}">
                                    <option value="watching">Watching</option>
                                    <option value="completed">Completed</option>
                                    <option value="planned">Planned</option>
                                    <option value="dropped">Dropped</option>
                                </select>
                            </div>
                            <div class="mb-3 col">
                                <label class="form-label" for="anime_type">Type</label>
                                <select class="form-select" name="editanime_type-${post['id']}" id="editanime_type-${post['id']}">
                                    <option value="anime">Anime</option>
                                    <option value="movie">Movie</option>
                                    <option value="ova">Ova</option>
                                </select>
                            </div>
                        </div>
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

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function renderVideoThumbnails(video) {
    const videosContainer = document.getElementById("update-videos-area")
    const wrapper = document.createElement("div")
    wrapper.innerHTML = `
    <div class="col-lg-4 col-md-6">
        <div class="card bg-black text-light border-secondary p-2 text-center">
            <div class="card-body">
            <div class="ratio ratio-16x9 mb-3 d-flex justify-content-center align-items-center">
                <div id="spinner-${video.id.videoId}" class="video-spinner position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
                    <div class="spinner-border"></div>
                </div>
                <iframe id="embed-${video.id.videoId}" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen class="rounded invisible" loading="lazy"></iframe>
            </div>
            <h5 class="card-title mb-3">
            ${decodeHtml(video.snippet.title)}
            </h5>
            <p class="small">${video.snippet.description}</p>
            </div>
            </div>
            </div>
    `
    const iframe = wrapper.querySelector("iframe");
    const spinner = wrapper.querySelector(`#spinner-${video.id.videoId}`);

    iframe.addEventListener("load", () => {
        iframe.classList.remove("invisible");
        spinner.classList.add("d-none")
    });

    videosContainer.appendChild(wrapper.firstElementChild)
}

function createACVideoUpdates(data) {
    if (data) {
        console.log(data)
        document.getElementById("update-videos-area").innerHTML = ""
        for (let i in data.items){
            renderVideoThumbnails(data.items[i])
        }
    }
}

function createTitleSearchThumbnails (data) {

}