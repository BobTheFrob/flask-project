export { jikanPostSearchHandler }
import { createPostCard, createTitleSearchThumbnails } from "./render.js"

const MAX_SEARCH_LIMIT = 4

async function updateTitleSearchSuggestions (q) {
    const response = await fetch(`/api/jikantitlesearch?q=${q}&limit=${MAX_SEARCH_LIMIT}`)
    const data = await response.json()
    const entries = data["data"]
    createTitleSearchThumbnails(entries)
    return data
};


// helper to set active item in search titles
function setActive(suggestionsChildren, index) {
    if (suggestionsChildren[index]) {
        suggestionsChildren[index].classList.add("dliitemhover")
    }
}


function setTitleValue(element) {
    let title = document.getElementById("title")
    if (element) {
        title.value = element.dataset.title
        const form = document.getElementById("post-form")
        form.dataset.malId = element.dataset.malId
        form.dataset.imgUrl = element.dataset.imgUrl
    } 
    else title.value = ""
}

// TITLE SEARCH HANDLER
// Handles jikan api call search
//
function jikanPostSearchHandler () {
    let suggestions = document.getElementById("suggestions")
    let suggestionsChildren = suggestions.children;
    let title = document.getElementById("title")
    let timerId = null
    let index = -1
    const clearHoverClasses = () => {
            for (let i = 0; i < suggestionsChildren.length; i++) {
                suggestionsChildren[i].classList.remove("dliitemhover")
            }
    }
    title.addEventListener("keydown", (e) => {
        if (e.key == "ArrowDown") {
            index++
            if (index >= suggestionsChildren.length) index = -1
            clearHoverClasses()
            setActive(suggestionsChildren, index)
            setTitleValue(suggestionsChildren[index])
        } 

        else if (e.key == "ArrowUp") {
            index--
            if (index < -1) index = suggestionsChildren.length - 1
            clearHoverClasses()
            setActive(suggestionsChildren, index)
            setTitleValue(suggestionsChildren[index])
        } 
    })
    title.addEventListener("focusin", async () => {
        suggestions.classList.remove("d-none")        
    })
    title.addEventListener("focusout", async () => {
        clearTimeout(timerId)
        suggestions.classList.add("d-none")
    })
    title.addEventListener("input", async () => {
        index = -1
        clearTimeout(timerId)
        if(title.value) {
            timerId = setTimeout(async ()=>{await updateTitleSearchSuggestions(title.value)}, 500)
        } else {
            createTitleSearchThumbnails(null)
        }
    })
    suggestions.addEventListener("mouseover", (e) => {
        const item = e.target.closest(".list-group-item")
        if (!item) return
        index = -1
        setTitleValue(item)
        clearHoverClasses()
    })
}