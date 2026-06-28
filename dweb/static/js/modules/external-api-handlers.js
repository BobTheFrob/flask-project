export { jikanPostSearchHandler }
import { createPostCard, createTitleSearchThumbnails } from "./render.js"

const MAX_SEARCH_LIMIT = 4
const JIKAN_DEBOUNCE_TIMEOUT = 500

async function updateTitleSearchSuggestions (q, suggestions) {
    const response = await fetch(`/api/jikantitlesearch?q=${q}&limit=${MAX_SEARCH_LIMIT}`)
    const data = await response.json()
    const entries = data["data"]
    createTitleSearchThumbnails(entries, suggestions)
    return data
};


// helper to set active item in search titles
function setActive(suggestionsChildren, index) {
    if (suggestionsChildren[index]) {
        suggestionsChildren[index].classList.add("dliitemhover")
    }
}


function setTitleValue(childElement, titleElement, formElement) {
    if (childElement) {
        titleElement.value = childElement.dataset.title
        formElement.dataset.malId = childElement.dataset.malId
        formElement.dataset.imgUrl = childElement.dataset.imgUrl
    } 
    else title.value = ""
}

// TITLE SEARCH HANDLER
// Handles jikan api call search
//
function jikanPostSearchHandler (suggestionsElement, titleElement, formElement) {
    let suggestionsChildren = suggestionsElement.children;
    let timerId = null
    let index = -1
    const clearHoverClasses = () => {
            for (let i = 0; i < suggestionsChildren.length; i++) {
                suggestionsChildren[i].classList.remove("dliitemhover")
            }
    }
    titleElement.addEventListener("keydown", (e) => {
        if (e.key == "ArrowDown") {
            index++
            if (index >= suggestionsChildren.length) index = -1
            clearHoverClasses()
            setActive(suggestionsChildren, index)
            setTitleValue(suggestionsChildren[index], titleElement, formElement)
        } 

        else if (e.key == "ArrowUp") {
            index--
            if (index < -1) index = suggestionsChildren.length - 1
            clearHoverClasses()
            setActive(suggestionsChildren, index)
            setTitleValue(suggestionsChildren[index], titleElement, formElement)
        } 
    })
    titleElement.addEventListener("focusin", async () => {
        suggestionsElement.classList.remove("d-none")        
    })
    titleElement.addEventListener("focusout", async () => {
        clearTimeout(timerId)
        suggestionsElement.classList.add("d-none")
    })
    titleElement.addEventListener("input", async () => {
        index = -1
        clearTimeout(timerId)
        if(titleElement.value) {
            timerId = setTimeout(async ()=>{await updateTitleSearchSuggestions(titleElement.value, suggestionsElement)}, JIKAN_DEBOUNCE_TIMEOUT)
        } else {
            createTitleSearchThumbnails(null, null)
        }
    })
    suggestionsElement.addEventListener("mouseover", (e) => {
        const item = e.target.closest(".list-group-item")
        if (!item) return
        index = -1
        setTitleValue(item, titleElement, formElement)
        clearHoverClasses()
    })
}