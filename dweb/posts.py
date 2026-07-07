from flask import Blueprint
from flask import (
    Blueprint, render_template, request, session, jsonify
)
from . import models, cache
from .auth import login_required_api, login_required_page
from urllib.parse import urlparse

bp = Blueprint('posts', __name__)

ALLOWED_DOMAINS = {
    "crunchyroll.com",
    "www.crunchyroll.com",
    "netflix.com",
    "www.netflix.com",
    "hidive.com",
    "www.hidive.com",
    "www.miruro.to"
}

# POSTS
# Posts page route. Render the posts page template. If the request method is POST, add a post to the database and redirect to the posts page.
#
@bp.route('/posts',  methods = ['GET'])
@login_required_page
def posts_page():
    posts = models.get_all_posts(session.get("user_id"))
    return render_template("posts.html", posts=posts)

####___________________________####
####                           ####
####        API ROUTES         ####
####___________________________####

posts_apibp = Blueprint('posts_api', __name__, url_prefix='/api')


### HELPERS ###
# Helper function to convert a post to a dictionary. This is used to convert the post to json when returning it in the API routes in preferred order.
def post_dict(post):
    return ({
        "title": post["title"],
        "id": post["id"],
        "mal_id": post["mal_id"],
        "description": post["body"],
        "score": post["score"],
        "watching_status": post["watching_status"],
        "anime_type": post["anime_type"],
        "created": post["created"],
        "image_url": post["image_url"],
        "watch_link": post["watch_link"]
    })

def post_dict_sql(post):
    postReturn = post_dict(post)
    postReturn['body'] = postReturn.pop('description')
    return postReturn

# Helper function to validate dropdown fields like anime_type and watching_status
def validateEnumFields(post):
    MEDIA_TYPES = {
        "tv": "TV",
        "movie": "Movie",
        "ova": "OVA",
        "special": "Special",
        "ona": "ONA",
        "music": "Music",
        "cm": "CM",
        "pv": "PV",
        "tv special": "TV Special",
        "misc": "Miscellaneous"
    }
    WATCH_STATUSES = {
        "planned": "Planned",
        "watching": "Watching",
        "completed": "Completed",
        "dropped": "Dropped"
    }
    return post["anime_type"] in MEDIA_TYPES and post["watching_status"] in WATCH_STATUSES

# Return nomralized data from a request json
def getRequestPost (data):
    post = {
        "title": (data.get("title") or "").strip(),
        "user_id": session.get("user_id"),
        "mal_id": None,
        "body": (data.get("description") or "").strip(),
        "score": None,
        "watching_status": (data.get('watching_status')) or "watching",
        "anime_type": data.get('anime_type') or "tv",
        "image_url": data.get('image_url') or "",
        "watch_link": data.get('watch_link') or ""
    }
    if data.get('score') not in ("", None):
        post["score"] = data.get('score')
    if data.get('mal_id') not in ("", None):
        post["mal_id"] = data.get('mal_id')
    return post

# Helper for returning 204, returns true if nothing changed: semantically makes sense i.e. not PostChanged
def postChanged(postPut, postGet):
    return not (str(postGet["body"]) == str(postPut["body"]) 
            and (postGet["score"] == postPut["score"] and postPut["score"] is not None)
            and str(postGet["watching_status"]) == str(postPut["watching_status"])
            and str(postGet["anime_type"]) == str(postPut["anime_type"])
            and str(postGet["title"]) == str(postPut["title"])
            and str(postGet["image_url"]) == str(postPut["image_url"])
            and str(postGet["watch_link"]) == str(postPut["watch_link"])
            )

# Check int inputs from regulated post
def checkRequestIntInputs(post):
    if post.get("score") is not None:
        try:
            post["score"] = int(post["score"])
        except (ValueError, TypeError):
            return jsonify({"error": "Score must be a number."}), 400
        if not 0 <= post["score"] <= 10:
            return jsonify({
                "error": "Invalid score. Score must be between 0 and 10."
            }), 400
        
    if post.get("mal_id") is not None:
        try:
            post["mal_id"] = int(post["mal_id"])
        except (ValueError, TypeError):
            return jsonify({"error": "mal_id must be a number."}), 400
        if post["mal_id"] <= 0:
            return jsonify({
                "error": "Invalid mal_id. mal_id must be greater than 0."
            }), 400
        
    if urlparse(post.get("watch_link")).hostname not in ALLOWED_DOMAINS:
        return jsonify({
                "error": f"Watch link must be in one of the following: {', '.join(str(x) for x in ALLOWED_DOMAINS)}" 
            }), 400
        

# Only populate post with request parameters
def getPatchRequestPost(data, post_id):
    post = {}
    allowed_fields = {
    "title",
    "description",
    "score",
    "watching_status",
    "anime_type",
    "mal_id",
    "image_url",
    "watch_link",
    }
    post["user_id"] = session.get("user_id")
    post["id"] = post_id
    for key, value in data.items():
        if key not in allowed_fields:
            continue

        if key in ("title", "description"):
            if (key == "description"):
                post["body"] = (value or "").strip()
            else: post[key] = (value or "").strip()

        elif key in ("score", "mal_id"):
            post[key] = None if value in ("", None) else value

        elif key in ("image_url", "watch_link"):
            post[key] = value or ""

        else:
            post[key] = value
    return post

# ALL POSTS API
# Posts api route. Return the posts in json. If the request method is POST, add a post to the database and redirect to the posts page.
#
@posts_apibp.route('/posts',  methods = ['GET', 'POST'])
@login_required_api
def api_posts():
    if request.method == 'GET':
        posts = models.get_all_posts(session.get("user_id"))
        return jsonify([post_dict(post) for post in posts])
    
    if request.method == 'POST':
        data = request.get_json() or {}
        post = getRequestPost(data)
        error = checkRequestIntInputs(post)
        if error:
            return error
        if not post["title"] or not post["title"].strip():
            return jsonify({
                "error": "Post must have a title.",
            }), 400
        if not validateEnumFields(post):
            return jsonify({
                "error": "Invalid type.",
            }), 400
        id = models.add_post(post)
        postReturned = post_dict(models.get_post_by_id(session.get("user_id"), id))

        return jsonify({
            "message": "Post created.",
            "post": postReturned
        }), 200

# POST BY ID API
# Post api routed by id. Return the post in json. If the request method is PATCH, 
# edit the post in the database and return 200. 
# If the request method is DELETE, delete the post from the database and return 200. If the post does not exist, return 404.
#
@posts_apibp.route('/posts/<int:post_id>',  methods = ['GET', 'PATCH', 'DELETE'])
@login_required_api
def get_post(post_id):

    # Validate post exists
    postValidate = models.get_post_by_id(session.get("user_id"), post_id)
    if not postValidate:
        return jsonify({
                "error": "Post not found",
            }), 404
    
    # GET POST BY ID
    if request.method == 'GET':
        return jsonify(post_dict(postValidate))
    
    # EDIT POST
    if request.method == 'PATCH':
        data = request.get_json() or {}
        post = getPatchRequestPost(data, post_id)
        try:
            error = checkRequestIntInputs(post)
            if error:
                return error
            for key, value in post_dict_sql(postValidate).items():
                if key not in post:
                    post[key] = value
            if not validateEnumFields(post):
                return jsonify({
                    "error": "Invalid type.",
                }), 400
            if (not postChanged(post, postValidate)):
                return "", 204
            models.edit_post(post)
            postReturn = post_dict(models.get_post_by_id(session.get("user_id"), post_id))
            return jsonify({
                "message": "Post edited.",
                "post": postReturn
            }), 200
        except Exception as e:
            return jsonify({
                "error": "Internal Server Error"
            }), 500
        
    # DELETE POST
    if request.method == 'DELETE':
        try: 
            models.delete_post(session.get("user_id"), post_id)
            return jsonify({
                "message": "Post deleted.",
            }), 200
        except Exception as e:
            return jsonify({
                "error": "Internal Server Error"
            }), 500
        
# INIT APP
# 
#
def init_app(app):
    app.register_blueprint(bp)
    app.register_blueprint(posts_apibp)
