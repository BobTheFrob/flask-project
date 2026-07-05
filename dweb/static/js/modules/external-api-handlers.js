export { jikanPostSearchHandler }
import { createPostCard, createTitleSearchThumbnails } from "./render.js"

const MAX_SEARCH_LIMIT = 4
const JIKAN_DEBOUNCE_TIMEOUT = 1000

async function updateTitleSearchSuggestions (q, suggestions) {
    let message = document.querySelector(".dpostsapimessage")
    const response = await fetch(`/api/jikantitlesearch?q=${q}&limit=${MAX_SEARCH_LIMIT}`)
    if (response.ok) {
        const data = await response.json()
        const entries = data["data"]
        createTitleSearchThumbnails(entries, suggestions)
        message.classList.remove("text-danger", "text-warning")
        return data
    } else if (response.status == 504) {
        message.textContent = "The jikan api is down rn. :("
        message.classList.add("text-warning")
        message.classList.remove("text-success", "text-danger")
    } else if (response.status == 429) {
        message.textContent = "Too many requests! >:("
        message.classList.add("text-danger")
        message.classList.remove("text-success", "text-warning")
    } else {
        message.textContent = "Something went wrong. :("
        message.classList.add("text-warning")
        message.classList.remove("text-success", "text-warning")
    }
};


// helper to set active item in search titles
function setActive(suggestionsChildren, index) {
    if (suggestionsChildren[index]) {
        suggestionsChildren[index].classList.add("dliitemhover")
    }
}


function setTitleValue(childElement, titleElement, formElement, suggestionSelect) {
    if (childElement) {
        titleElement.value = childElement.dataset.title
        formElement.dataset.malId = childElement.dataset.malId
        formElement.dataset.imgUrl = childElement.dataset.imgUrl
        formElement.dataset.animeType = childElement.dataset.animeType
        formElement.querySelector(".anime-type").value = String(childElement.dataset.animeType).toLowerCase()
        suggestionSelect.classList.remove("dhiddenarea")
        suggestionSelect.querySelector("h5").textContent = childElement.dataset.title
        suggestionSelect.querySelector("img").src = childElement.dataset.imgUrl 
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
    let userInput = titleElement.value
    const suggestionSelect = formElement.querySelector(".suggestion-selected")
    suggestionSelect.querySelector("button").addEventListener("click", (e) => {
        e.preventDefault()
        suggestionSelect.classList.add("dhiddenarea")
        formElement.dataset.malId = ""
        formElement.dataset.imgUrl = ""
        formElement.dataset.animeType = ""
    })
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
            setTitleValue(suggestionsChildren[index], titleElement, formElement, suggestionSelect)
        } 

        else if (e.key == "ArrowUp") {
            index--
            if (index < -1) index = suggestionsChildren.length - 1
            clearHoverClasses()
            setActive(suggestionsChildren, index)
            setTitleValue(suggestionsChildren[index], titleElement, formElement, suggestionSelect)
        } 
        if (e.key === 'Enter') {
            e.preventDefault();
            suggestionsElement.classList.add("d-none")
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
        setTitleValue(item, titleElement, formElement, suggestionSelect)
        clearHoverClasses()
    })
}