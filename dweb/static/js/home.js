import {logoutHandler} from "./auth.js"
import {renderVideoThumbnails} from "./modules/render.js"


logoutHandler()

function createACVideoUpdates(data) {
    if (data) {
        document.getElementById("update-videos-area").innerHTML = ""
        for (let i in data.items){
            renderVideoThumbnails(data.items[i])
        }
    }
}

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
