import Base from './Base'
import { BasicBSSpinner } from './Base'
import { useEffect, useState } from 'react';
import { useAuth } from '../components/UserProvider';

const QUERY = "jojos bizarre adventure sbr"
const MAXSECONDS = 1800

function htmlToText(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function VideoCard({ video }) {
    const [loading, setLoading] = useState(true)

    return (
        <div className="col-lg-4 col-md-6">
            <div className="card bg-black text-light border-secondary p-2 text-center">
                <div className="card-body">
                    <div className="ratio ratio-16x9 mb-3 position-relative">
                        {loading && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
                                <BasicBSSpinner></BasicBSSpinner>
                            </div>
                        )}
                        <iframe
                            src={`https://www.youtube.com/embed/${video.id.videoId}`}
                            allowFullScreen
                            className={`rounded ${loading ? "invisible" : ""}`}
                            loading="lazy"
                            onLoad={() => setLoading(false)}
                        />
                    </div>

                    <h5 className="card-title mb-3">
                        {decodeHtml(video.snippet.title)}
                    </h5>

                    <p className="small">
                        {htmlToText(video.snippet.description)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function Home () {
    const {user, userLoading} = useAuth()
    const [videosJson, setVideosJson] = useState([])

    const videos = videosJson.map(video => (
                        <VideoCard
                            key={video.id.videoId}
                            video={video}
                        />
                    ))

    useEffect(() => {
        async function fetchData() {
            if (user) {
                const response = await fetch(`/api/videoupdates?max=${MAXSECONDS}&key=youtube:${QUERY}`)
                if (response.status == 200) {
                    const json = await response.json()
                    setVideosJson(json.items)
                }
                else {
                    setVideosJson(null)
                }
            }
        }
        fetchData()
    }, [user])

    return (
        <Base title="Home">
            <div className="card bg-black text-light border-secondary mb-3">
                <div className="card-body">
                <p>Hello world, welcome to my site!</p>
                <p>
                    Armed with knowledge from my CS3720 course, this is my first Flask
                    project.
                </p>
                <p>
                    I'm planning to make simple media tracking, like favourites and stuff.
                </p>
                <h4>Here's some videos on Jojo's in the meantime!</h4>
                </div>
                    {userLoading && <BasicBSSpinner/>}
            </div>
            <div>
                <div className="row g-3" id="update-videos-area">
                    {
                    userLoading?
                        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center pt-5">
                        <BasicBSSpinner styles={{width: "5rem", height: "5rem"}}></BasicBSSpinner> 
                        <p className="pt-3">Videos are loading.</p>
                        </div>
                    : 
                        user?
                            videos : <p>Please log in to see video updates.</p>
                    }
                </div>
            </div>
        </Base>
    )
}