import Base from './Base'
import { useState, useEffect } from 'react'
import { parseResponse, htmlToText } from '../utils/helpers';
import { HiddenMessage } from '../components/CuteSmallerComponentsRawrXdUwU';


function PostCard ({post, toggleEditIndex, isActive, fetchPosts}) {
    const [submitResponseJson, setSubmitResponseJson] = useState({
        success: null,
        message: "",
        type: ""
    })
    const [editPost, setEditPost] = useState({
        id: post.id,
        title: post.title,
        score: post.score || null,
        description: post.description,
        watch_link: post.watch_link,
        watching_status: post.watching_status,
        anime_type: post.anime_type
    })

    async function deleteHandler() {
        await fetch(`/api/posts/${post.id}`, {
            method: "DELETE"})
            fetchPosts()
    }

    async function editHandler() {
        const response = await fetch(`/api/posts/${post.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                title: editPost.title, description: editPost.description, score: editPost.score, 
                watching_status: editPost.watching_status, anime_type: editPost.anime_type, image_url: editPost.image_url,
                mal_id: editPost.mal_id, watch_link: editPost.watch_link
                })
            })
        setSubmitResponseJson(await parseResponse(response))
        response.status === 200 && toggleEditIndex()
        fetchPosts()
    }

    return (
        <div className="col-xl-3 col-lg-4 col-md-6 post-card">
            <div className="card bg-black text-light border-secondary">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                        <h2 className="h4 card-title">{htmlToText(post.title)}</h2>
                        <h4><span className="badge text-bg-secondary">{post.score === 0 || post.score? String(post.score) + "/10" : ""}</span></h4>
                    </div>
                    <div className="d-flex justify-content-start gap-2 align-items-start mb-3">
                        <span className="badge text-bg-secondary text-capitalize fw-light">{post['watching_status']}</span>
                        <span className="badge text-bg-secondary text-capitalize fw-light">{post['anime_type']}</span>
                    </div>
                    {post.image_url? 
                        <div className="text-center my-2">
                            <img className="img-fluid dpostimage rounded" src={post['image_url']}/>                    
                        </div>
                        : <></>}
                    {post.watch_link && <a className="nav-link dwatchbtn text-center" href={post.watch_link} target="_blank">Watch</a>}
                    <p className="card-text dyprintnewline">{htmlToText(post.description)}</p>
                    <div className="d-flex align-items-center">
                        <p className="text-secondary small metadata-text mb-3 post-meta">Post #{post.id} — </p>
                        <span className="text-secondary small metadata-text mb-3 post-time">{new Date(post.created + " UTC").toLocaleString()}</span>
                    </div>
                    <div className="card-text d-flex justify-content-between gap-2">
                        <button className="btn btn-outline-light btn-sm flex-grow-1 edit-btn" onClick={toggleEditIndex}>
                            Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={deleteHandler}>
                            Delete
                        </button>
                    </div>
                        {isActive &&                         
                            <div className='mt-4'><PostFields compact={true}
                            postData={editPost} setPostData={setEditPost}>
                            </PostFields>
                            <HiddenMessage messageJson={submitResponseJson}></HiddenMessage>
                            <button className="btn btn-success w-100 mt-2" type="submit" onClick={editHandler}>Edit Post</button>
                            </div>
                        }
                </div>
            </div>
        </div>
    )
}

function PostFields ({postData, setPostData, compact=false}) {

    const fieldId = name => postData.id ? `edit-${name}-${postData.id}` : name

    function handleChange(e) {
        setPostData(current => ({
            ...current,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <>
        
            <div className="row">
                <div className={compact? "mb-3" : "mb-3 col-lg-9"}>
                    <label className="form-label" htmlFor={fieldId("title")}>Title<i className="text-danger">*</i></label>
                    <input className="form-control" name="title" id={fieldId("title")} value={postData.title} onChange={handleChange} autoComplete="off" required/>
                </div>
                <div className="mb-3 col">
                    <label className="form-label" htmlFor={fieldId("score")}>Score</label>
                    <input className={compact? "form-control w-auto" : "form-control"} type="number" min="0" max="10" name="score" id={fieldId("score")} 
                    value={postData.score? postData.score : ""} onChange={handleChange}/>
                </div>
            </div>


            <div className="mb-3">
                <label className="form-label" htmlFor={fieldId("description")}>Description</label>
                <textarea className="form-control mb-3" name="description" id={fieldId("description")} value={postData.description} onChange={handleChange} rows="4"></textarea>
                <label className="form-label" htmlFor={fieldId("watch_link")} autoComplete="off">Watch Link</label>
                <input className="form-control" name="watch_link" id={fieldId("watch_link")} value={postData.watch_link} onChange={handleChange}/>
                <div className="my-3 row">
                    <div className="col">
                        <label className="form-label" htmlFor={fieldId("watching_status")}>Status</label>
                        <select className="form-select" name="watching_status" id={fieldId("watching_status")} value={postData.watching_status} onChange={handleChange}>
                            <option value="watching">Watching</option>
                            <option value="completed">Completed</option>
                            <option value="planned">Planned</option>
                            <option value="dropped">Dropped</option>
                        </select>
                    </div>
                    <div className="col">
                        <label className="form-label" htmlFor={fieldId("anime_type")}>Type</label>
                        <select className="form-select anime-type" name="anime_type" id={fieldId("anime_type")} value={postData.anime_type} onChange={handleChange}>
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
        </>
    )
}

function NewPostSection ({fetchPosts}) {
    const [submitResponseJson, setSubmitResponseJson] = useState({
        success: null,
        message: "",
        type: ""
    })
    const [postData, setPostData] = useState({
        title: "",
        score: "",
        description: "",
        watch_link: "",
        watching_status: "watching",
        anime_type: "tv"
    })

    async function handleSubmit(e) {
        e.preventDefault()
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            title: postData.title, description: postData.description, score: postData.score, 
            watching_status: postData.watching_status, anime_type: postData.anime_type, image_url: postData.image_url,
            mal_id: postData.mal_id, watch_link: postData.watch_link
            })
        })
        setPostData({
        title: "",
        score: "",
        description: "",
        watch_link: "",
        watching_status: "watching",
        anime_type: "tv"
        })
        setSubmitResponseJson(await parseResponse(response))
        fetchPosts()
    }

    return (
        <div className="col-lg-6">
            <div className="card bg-black text-light border-secondary mb-4">
                <div className="card-body mt-3">
                    <h2 className="h4 card-title">Track an anime</h2>
                    <p className="card-text">Share your thoughts and opinions by tracking an anime! Just give it a title, and any other field inside if you want.</p>
                    <form method="post" onSubmit={handleSubmit}>
                        <PostFields postData={postData} setPostData={setPostData}></PostFields>
                        <button className="btn btn-success w-100" type="submit">Post</button>
                        <div className="mt-4">
                        <HiddenMessage messageJson={submitResponseJson}></HiddenMessage>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function Posts () {
    const [postsJson, setPostsJson] = useState([])
    const [editIndex, setEditIndex] = useState(-1)

    const posts = postsJson.posts?.map(post => (
            <PostCard
                key={post.id}
                post={post}
                isActive={editIndex === post.id}
                toggleEditIndex={() => {
                    editIndex !== post.id? setEditIndex(post.id) : setEditIndex(-1)
                    }
                }
                fetchPosts={fetchPosts}
            />
        ))

    async function fetchPosts() {
        const response = await fetch("/api/posts?limit=16&offset=0", {
            method: "GET"
        })
        const json = await response.json()
        setPostsJson(json)
    }
                    
    useEffect(() => {
        fetchPosts()
    }, [])


    return (
        <Base title="Anime">
            <div className="row row-cols-1 row-cols-lg-4">
                <NewPostSection fetchPosts={fetchPosts}></NewPostSection>
            </div>
            <div className="row g-3" id="posts-container">
                {posts}
            </div>
        </Base>
    )
}