import {logoutHandler} from "./modules/handlers.js"
import {createACVideoUpdates} from "./modules/render.js"

document.getElementById("logout-btn")? logoutHandler() : null


async function updateACVideos(max) {
    const response = await fetch(`/api/acupdates?max=${max}&key=youtube:ac_black_flag_resynced`)
    if (response.status == 200) {
        const json = await response.json()
        createACVideoUpdates(json)
    }
    else {
        createACVideoUpdates(null)
    }
}

updateACVideos(1800)

document.getElementById("force-update-btn").addEventListener("click", (e) => {
    e.preventDefault()
    updateACVideos(0)
})