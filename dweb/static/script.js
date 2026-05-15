function edit_post(id) {
    textarea = document.getElementById(`editform-${id}`)
    textarea.classList.toggle("dhiddentextarea");
}

document.querySelectorAll(".post-time").forEach(span => {
    const time = new Date(span.textContent + " UTC")
    span.textContent = time.toLocaleString()
})

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
                console.log(data)
                const postCard = document.getElementById(`post-${postId}`)
                if (postCard) {
                    postCard.remove()
                }
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
        console.log(postId, body, score)
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
            console.log(data)
            document.getElementById(`post-${postId}`).querySelector(".card-text").textContent = body
            document.getElementById(`post-${postId}`).querySelector(".badge").textContent = `${score}/10`
            edit_post(postId)
        } catch (err) {
            console.error(err)
        }
        })
}

function createPostCard(post) {
    const wrapper = document.createElement("div")
    wrapper.innerHTML = `
        <div class="col-lg-4 col-md-6 post-card">
            <div class="card bg-black text-light border-secondary">
                <div class="card-body">
                    <h2 class="h4 card-title"></h2>
                    <h4><span class="badge text-bg-secondary my-2"></span></h4>
                    <p class="card-text dyprintnewline"></p>
                    <div class="d-flex align-items-center">
                    <p class="text-secondary small mb-3 post-meta"></p>
                    <span class="text-secondary small mb-3 post-time"></span>
                    </div>
                    <div class="card-text container-fluid row g-2 center d-flex justify-content-center">
                        <button class="btn btn-outline-light btn-sm col-lg-8 edit-btn">
                            Edit
                        </button>
                        <form class="col-lg-4 delete-form">
                            <button class="btn btn-danger btn-sm" type="submit">
                                Delete
                            </button>
                        </form>
                    </div>
                    <form class="dhiddentextarea mt-3 edit-form">
                        <div class="card-text container-fluid g-2 center d-flex justify-content-start align-items-center p-0">
                            <p class="text-secondary w-auto">
                                Score:
                            </p>
                            <input
                                class="form-control mb-2 mx-2 w-auto edit-score"
                                type="number"
                                min="0"
                                max="10"
                                required>
                        </div>
                        <p class="text-secondary">Description: </p>
                        <textarea class="form-control mb-2 edit-desc" rows="4"></textarea>
                        <button class="btn btn-success btn-sm" type="submit">Confirm</button>
                    </form>
                </div>
            </div>
        </div>
    `

    // ROOT CARD
    const card = wrapper.querySelector(".post-card")
    card.id = `post-${post.id}`

    // TITLE
    wrapper.querySelector(".card-title").textContent =
        post.title

    // SCORE BADGE
    wrapper.querySelector(".badge").textContent =
        `${post.score}/10`

    // BODY
    wrapper.querySelector(".dyprintnewline").textContent =
        post.description

    // META
    wrapper.querySelector(".post-meta").textContent = `Post #${post.id} — `
    wrapper.querySelector(".post-time").textContent = `${new Date(post.created + " UTC").toLocaleString()}`

    // EDIT BUTTON
    const editBtn = wrapper.querySelector(".edit-btn")
    editBtn.id = `editbtn-${post.id}`
    editBtn.addEventListener("click", () => {
        edit_post(post.id)
    })

    // DELETE FORM
    const deleteForm = wrapper.querySelector(".delete-form")
    deleteForm.method = "post"
    deleteForm.action = `/posts/delete/${post.id}`
    deletePostHandler(deleteForm)

    // EDIT FORM
    const editForm = wrapper.querySelector(".edit-form")

    editForm.id = `editform-${post.id}`
    editForm.action = `/posts/edit/${post.id}`
    editForm.method = "post"
    editPostHandler(editForm)

    // SCORE INPUT
    const scoreInput = wrapper.querySelector(".edit-score")
    scoreInput.id = `editscore-${post.id}`
    scoreInput.name = `editscore-${post.id}`
    scoreInput.value = post.score

    // TEXTAREA
    const textarea = wrapper.querySelector(".edit-desc")

    textarea.id = `editdesc-${post.id}`
    textarea.name = `editdesc-${post.id}`
    textarea.value = post.description

    return wrapper.firstElementChild
}

document.querySelectorAll(".delete-form").forEach(form => {
    deletePostHandler(form)
})

document.querySelectorAll(".edit-form").forEach(form => {
    editPostHandler(form)
})

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
        console.log(data)
        document.getElementById("posts-container").appendChild(createPostCard(data.post))
    } catch (err) {
        console.error(err)
    }
    e.target.reset()
})
