export { createPostCard, createTitleSearchThumbnails, renderVideoThumbnails }
import { deletePostHandler, editPostHandler, showEditTextArea } from "./handlers.js";

function htmlToText(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
}

function createPostCard(post) {
    const wrapper = document.createElement("div")
    wrapper.innerHTML = `
        <div class="col-xl-3 col-lg-4 col-md-6 col-6 post-card" id="post-${post.id}">
            <div class="card bg-black text-light border-secondary">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h2 class="h4 card-title" id="post-${post.id}-title">${htmlToText(post.title)}</h2>
                        <h4><span class="badge text-bg-secondary" id="post-${post.id}-score">${post.score === 0 || post.score? String(post.score) + "/10" : ""}</span></h4>
                    </div>
                    <div class="d-flex justify-content-start gap-2 align-items-start mb-3">
                        <span class="badge text-bg-secondary text-capitalize fw-light" id="post-${post.id}-watching_status">${post['watching_status']}</span>
                        <span class="badge text-bg-secondary text-capitalize fw-light" id="post-${post.id}-anime_type">${post['anime_type']}</span>
                    </div>
                    ${post.image_url? `
                        <div class="text-center my-2">
                            <img class="img-fluid dpostimage rounded" id="postimg-${post.id}" src="${post['image_url']}">                    
                        </div>
                        ` : ""}
                    <p class="card-text dyprintnewline" id="post-${post.id}-description">${htmlToText(post.description)}</p>
                    <div class="d-flex align-items-center">
                        <p class="text-secondary small metadata-text mb-3 post-meta">Post #${post.id} — </p>
                        <span class="text-secondary small metadata-text mb-3 post-time">${new Date(post.created + " UTC").toLocaleString()}</span>
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
                    <form class="dhiddenarea mt-3 edit-form" data-mal-id="${htmlToText(post.mal_id)}" data-img-url="${htmlToText(post.image_url)}" data-anime-type="${post.anime_type}">
                            <div class="card-text p-0 mt-4">
                                <div class="mb-3">
                                    <p class="text-secondary w-auto mb-2">Title: </p>
                                    <input autocomplete="off"
                                    class="form-control edit-title" id="edittitle-${post.id}" name="edittitle-${post.id}" value="${htmlToText(post.title)}"></input>
                                    <div id="suggestions-${post.id}" class="list-group position-absolute w-100 z-3 d-none"></div>
                                </div>
                                <div class="card-text container-fluid g-2 center d-flex justify-content-start align-items-center p-0">
                                    <p class="text-secondary w-auto">
                                        Score:
                                    </p>
                                    <input
                                    id = "editscore-${post.id}" name="editscore-${post.id}" 
                                    class="form-control mb-2 mx-2 w-auto edit-score"
                                    type="number"
                                    min="0"
                                    max="10">
                                </div>
                            </div>
                            <div class="card suggestion-selected text-light border-secondary my-2 dhiddenarea">
                                <div class="card-body d-flex align-items-center justify-content-between gap-3">
                                    <h5 class="fs-6 h5 text-truncate"></h5>
                                    <img class="animethumbnail img-thumbnail">
                                </div>
                                <button type="button" class="position-absolute top-0 end-0 btn btn-sm btn-danger"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                            <p class="text-secondary">Description: </p>
                            <textarea class="form-control mb-2 edit-desc" id="editdesc-${post.id}" name="editdesc-${post.id}" rows="4" value="${htmlToText(post.description)}"></textarea>
                            <div class="mt-3 row">
                                <div class="mb-3 col">
                                    <label class="form-label" for="watching_status">Status</label>
                                    <select class="form-select" name="editwatching_status-${post['id']}" id="editwatching_status-${post['id']}">
                                        <option value="watching" ${post.watching_status === "watching"? "selected" : ""}>Watching</option>
                                        <option value="completed" ${post.watching_status === "completed"? "selected" : ""}>Completed</option>
                                        <option value="planned" ${post.watching_status === "planned"? "selected" : ""}>Planned</option>
                                        <option value="dropped" ${post.watching_status === "dropped"? "selected" : ""}>Dropped</option>
                                    </select>
                                </div>
                                <div class="mb-3 col">
                                    <label class="form-label" for="anime_type">Type</label>
                                    <select class="form-select anime-type" name="editanime_type-${post['id']}" id="editanime_type-${post['id']}">
                                        <option value="tv" ${post.anime_type === "tv"? "selected" : ""}>TV</option>
                                        <option value="movie" ${post.anime_type === "movie"? "selected" : ""}>Movie</option>
                                        <option value="special" ${post.anime_type === "special"? "selected" : ""}>Special</option>
                                        <option value="ova" ${post.anime_type === "ova"? "selected" : ""}>OVA</option>
                                        <option value="ona" ${post.anime_type === "ona"? "selected" : ""}>ONA</option>
                                        <option value="music" ${post.anime_type === "music"? "selected" : ""}>Music</option>
                                        <option value="cm" ${post.anime_type === "cm"? "selected" : ""}>CM</option>
                                        <option value="pv" ${post.anime_type === "pv"? "selected" : ""}>PV</option>
                                        <option value="tv special" ${post.anime_type === "tv special"? "selected" : ""}>TV Special</option>
                                        <option value="misc" ${post.anime_type === "misc"? "selected" : ""}>Miscellaneous</option>
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
    textarea.value = htmlToText(post.description)

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
            <p class="small">${htmlToText(video.snippet.description)}</p>
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

function createTitleSearchThumbnails (data, suggestionsBox) {
    if(!suggestionsBox) return
    let wrapper = document.createElement("div")
    suggestionsBox.innerHTML = ""
    for (let i in data) {
        const entry = data[i]
        wrapper.innerHTML = `
            <button class="list-group-item list-group-item-action d-flex gap-2 py-2 dliitem" data-mal-id="${entry.mal_id}"
            data-title="${entry.title}" data-img-url="${entry.image_url}"
            data-anime-type="${entry.type}">
                <div class="d-flex w-100 justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <div>
                                <h5 class="fs-6 h5">${entry.title}</h5>
                                <small class="text-secondary fs-6 text-capitalize">${entry.type? String(entry.type + " • ") : ""}${entry.episodes > 1? String(entry.episodes + " eps") : "1 ep"} </small>
                            </div>
                        </div>
                        <div class="ms-auto">
                            <img class="animethumbnail img-thumbnail" src="${entry.image_url}">
                        </div>
                </div>
            </button>
            `
        suggestionsBox.appendChild(wrapper.firstElementChild)
    }
}