import {logoutHandler} from "./auth.js"
import {createACVideoUpdates} from "./modules/render.js"


logoutHandler()


async function updateACVideos(max) {
    const response = await fetch(`/api/videoupdates?max=${max}&key=youtube:ac black flag resynced`)
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
    updateACVideos(0)
})