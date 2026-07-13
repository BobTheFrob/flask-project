import {logoutHandler} from "./auth.js"
import {renderVideoThumbnails} from "./modules/render.js"


logoutHandler()

const QUERY = "jojos bizarre adventure sbr"

function createVideoUpdates(data) {
    if (data) {
        document.getElementById("update-videos-area").innerHTML = ""
        for (let i in data.items){
            renderVideoThumbnails(data.items[i])
        }
    }
}

async function createUpdatedVideos(max, query) {
    const response = await fetch(`/api/videoupdates?max=${max}&key=youtube:${query}`)
    if (response.status == 200) {
        const json = await response.json()
        createVideoUpdates(json)
    }
    else {
        createVideoUpdates(null)
    }
}

createUpdatedVideos(1800, QUERY)
