export default function PostFields ({postData, setPostData, compact=false}) {

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