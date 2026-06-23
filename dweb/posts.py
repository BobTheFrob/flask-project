from flask import Blueprint
from flask import (
    Blueprint, render_template, request, session, jsonify
)
from . import models, cache
from .auth import login_required_api, login_required_page

bp = Blueprint('posts', __name__)

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
        "miruro_watch_link": post["miruro_watch_link"]
    })

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

def getRequestPost (data):
    post = {
        "title": (data.get("title") or "").strip(),
        "user_id": session.get("user_id"),
        "mal_id": data.get('mal_id'),
        "body": (data.get("description") or "").strip(),
        "score": data.get('score'),
        "watching_status": (data.get('watching_status')),
        "anime_type": data.get('anime_type'),
        "image_url": data.get('image_url') or "",
        "miruro_watch_link": data.get('miruro_watch_link') or ""
    }
    return post

# GET ALL POSTS API
# Posts api route. Return the posts in json. If the request method is POST, add a post to the database and redirect to the posts page.
#
@posts_apibp.route('/posts',  methods = ['GET', 'POST'])
@login_required_api
def api_posts():
    if request.method == 'GET':
        posts = models.get_all_posts()
        return jsonify([post_dict(post) for post in posts])
    
    if request.method == 'POST':
        data = request.get_json() or {}
        post = getRequestPost(data)
        if post["score"] and (int(post["score"]) > 10 or int(post["score"])) < 0:
            return jsonify({
                "message": "Invalid score. Score must be between 0 and 10."
            }), 400
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

def postChanged(postPut, postGet):
    return not (str(postGet["body"]) == str(postPut["body"]) 
            and str(postGet["score"]) == str(postPut["score"])
            and str(postGet["watching_status"]) == str(postPut["watching_status"])
            and str(postGet["anime_type"]) == str(postPut["anime_type"])
            and str(postGet["title"]) == str(postPut["title"])
            and str(postGet["image_url"]) == str(postPut["image_url"])
            )


# POST BY ID API
# Post api routed by id. Return the post in json. If the request method is PUT, 
# edit the post in the database and return 200. 
# If the request method is DELETE, delete the post from the database and return 200. If the post does not exist, return 404.
#
@posts_apibp.route('/posts/<int:post_id>',  methods = ['GET', 'PUT', 'DELETE'])
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
    if request.method == 'PUT':
        data = request.get_json() or {}
        post = getRequestPost(data)
        try:
            if not post["title"]:
                return jsonify({
                    "error": "Post must have a title.",
                }), 400
            if post["score"] and (int(post["score"]) > 10 or int(post["score"])) < 0:
                return jsonify({
                    "message": "Invalid score. Score must be between 0 and 10."
                }), 400
            for key, value in post_dict(postValidate).items():
                if not post.get(key):
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
            print(e)
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
