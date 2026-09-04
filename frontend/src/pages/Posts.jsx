import Base from './Base'
import { useState, useEffect } from 'react'
import { useAuth } from '../components/UserProvider'

// anime picked thumbnail from suggestions
// <div className="row px-3">
//     <div className="card suggestion-selected text-light border-secondary my-2 col-lg-5 dhiddenarea">
//         <div className="card-body d-flex align-items-center justify-content-between gap-3">
//             <h5 className="fs-6 h5 text-truncate"></h5>
//             <img className="animethumbnail img-thumbnail"/>
//         </div>
//         <button type="button" className="position-absolute top-0 end-0 btn btn-sm btn-danger"><i className="fa-solid fa-xmark"></i></button>
//     </div>
// </div>

export default function Posts () {
    const {user, userLoading} = useAuth()
    const [videosJson, setVideosJson] = useState([])

    return (
        <Base title="Anime">
            <p id="posts-api-message" className="dpostsapimessage mb-4"></p>
            <div className="row row-cols-1 row-cols-lg-4">
                <div className="col-lg-6">
                    <div className="card bg-black text-light border-secondary mb-4">
                        <div className="card-body mt-3">
                            <h2 className="h4 card-title">Track an anime</h2>
                            <p className="card-text">Share your thoughts and opinions by tracking an anime! Just give it a title, and any other field inside if you want.</p>
                            <form method="post" id="post-form" data-mal-id="" data-img-url="" data-anime-type="">
                                <div className="row"> 
                                    <div className="mb-3 col-lg-9">
                                        <label className="form-label" htmlFor="title">Title<i className="text-danger">*</i></label>
                                        <input className="form-control" name="title" id="title" autoComplete="off" required/>
                                    </div>
                                    <div className="mb-3 col">
                                        <label className="form-label" htmlFor="score">Score</label>
                                        <input className="form-control" type="number" min="0" max="10" name="score" id="score"/>
                                    </div>
                                </div>


                                <div className="mb-3">
                                    <label className="form-label" htmlFor="description">Description</label>
                                    <textarea className="form-control mb-3" name="description" id="description" rows="4"></textarea>
                                    <label className="form-label" htmlFor="watch_link" autoComplete="off">Watch Link</label>
                                    <input className="form-control" name="watch_link" id="watch_link"/>
                                    <div className="my-3 row">
                                        <div className="col">
                                            <label className="form-label" htmlFor="watching_status">Status</label>
                                            <select className="form-select" name="watching_status" id="watching_status">
                                                <option value="watching">Watching</option>
                                                <option value="completed">Completed</option>
                                                <option value="planned">Planned</option>
                                                <option value="dropped">Dropped</option>
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label className="form-label" htmlFor="anime_type">Type</label>
                                            <select className="form-select anime-type" name="anime_type" id="anime_type">
                                                <option value="tv">TV</option>
                                                <option value="movie">Movie</option>
                                                <option value="special">Special</option>
                                                <option value="ova">OVA</option>
                                                <option value="ona">ONA</option>
                                                <option value="music">Music</option>
                                                <option value="cm">CM</option>
                                                <option value="pv">PV</option>
                                                <option value="tv special">TV Special</option>
                                                <option value="misc">Miscellaneous</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-success w-100" type="submit">Post</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <p id="posts-message" className="dpostsmessage mb-4"></p>
            <div className="row g-3" id="posts-container">
            </div>
        </Base>
    )
}