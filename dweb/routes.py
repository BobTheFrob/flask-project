from flask import Blueprint
from flask import (
    Blueprint, g, redirect, render_template, request, session, url_for, jsonify
)
from . import models

bp = Blueprint('main', __name__)

####____________________________####
####                            ####
####        FORM ROUTES         ####
####____________________________####

# MAIN PAGE
# Main page route. Render the main page template.
#
@bp.route('/')
def index():
    return render_template("main.html")

# POSTS
# Posts page route. Render the posts page template. If the request method is POST, add a post to the database and redirect to the posts page.
#
@bp.route('/posts',  methods = ['GET', 'POST'])
def posts_page():
    if request.method == 'GET':
        posts = models.get_all_posts()
        return render_template("posts.html", posts=posts)
    if request.method == 'POST':
        title = request.form['title']
        body = request.form['description']
        score = request.form['score']
        if not body.strip():
            body = ""
        if not title.strip() or not score.strip():
            posts = models.get_all_posts()
            return render_template(
                "posts.html",
                posts=posts,
                error="Post cannot be empty."
            )
        models.add_post(title, body, score)
        return redirect(url_for("main.posts_page"))

# DELETE POST
# Delete post route. If the request method is POST, delete the post from the database and redirect to the posts page.
#
@bp.route('/posts/delete/<int:post_id>',  methods = ['POST'])
def delete_post(post_id):
    if request.method == 'POST':
        try:
            if not models.get_post_by_id(post_id):
                return 'Post not found', 404
            models.delete_post(str(post_id))
            return redirect(url_for("main.posts_page"))
        except Exception as e:
            print(f"Delete error: {e}")  # Check logs
            return 'Internal Server Error', 500

# EDIT POST
# Edit post route. If the request method is POST, edit the post in the database and redirect to the posts page.
#
@bp.route('/posts/edit/<int:post_id>', methods=['POST'])
def edit_post(post_id):
    try:
        if not models.get_post_by_id(post_id):
            return 'Post not found', 404
        body = request.form[f'editdesc-{post_id}']
        score = request.form[f'editscore-{post_id}']
        post = models.get_post_by_id(post_id)
        if not body.strip():
            body = ""
        if str(post["body"]) == str(body) and str(post["score"]) == str(score):
            return render_template("posts.html", posts=models.get_all_posts(), warning="No changes detected.")
        models.edit_post(body, score, post_id)
        return redirect(url_for("main.posts_page"))

    except Exception as e:
        print(f"Edit error: {e}")
        return f'Internal Server Error: {e}', 500




####___________________________####
####                           ####
####        API ROUTES         ####
####___________________________####

apibp = Blueprint('api', __name__, url_prefix='/api')

# Helper function to convert a post to a dictionary. This is used to convert the post to json when returning it in the API routes in preferred order.
def post_dict(post):
    return ({
        "title": post["title"],
        "id": post["id"],
        "description": post["body"],
        "score": post["score"],
        "created": post["created"]
    })

# GET ALL POSTS API
# Posts api route. Return the posts in json. If the request method is POST, add a post to the database and redirect to the posts page.
#"
@apibp.route('/posts',  methods = ['GET', 'POST'])
def api_posts():
    if request.method == 'GET':
        posts = models.get_all_posts()
        return jsonify([post_dict(post) for post in posts])
    if request.method == 'POST':
        data = request.get_json() or {}
        title = data.get('title')
        desc = data.get('description')  
        score = data.get('score')
        if int(score) > 10 or int(score) < 0:
            return jsonify({
                "message": "Invalid score. Score must be between 0 and 10."
            }), 400
        if not title or not title.strip():
            posts = models.get_all_posts()
            return jsonify({
                "error": "Post cannot be empty.",
            }), 400
        id = models.add_post(title, desc, score)
        post = post_dict(models.get_post_by_id(id))

        return jsonify({
            "message": "Post created.",
            "post": post
        }), 200

# POST BY ID API
# Post api routed by id. Return the post in json. If the request method is PUT, 
# edit the post in the database and return 200. 
# If the request method is DELETE, delete the post from the database and return 200. If the post does not exist, return 404.
#
@apibp.route('/posts/<int:post_id>',  methods = ['GET', 'PUT', 'DELETE'])
def get_post(post_id):

    # Validate post exists
    post = models.get_post_by_id(post_id)
    if not post:
        return jsonify({
                "error": "Post not found",
            }), 404
    
    # GET POST BY ID
    if request.method == 'GET':
        return jsonify(post_dict(post))
    
    # EDIT POST
    if request.method == 'PUT':
        data = request.get_json() or {}
        body = data.get('description')
        score = data.get('score')
        try:
            if body is None or score is None:
                return jsonify({"error": "Missing description or score."}), 400
            if int(score) > 10 or int(score) < 0:
                return jsonify({
                    "message": "Invalid score. Score must be between 0 and 10."
                }), 400
            if str(post["body"]) == str(body) and str(post["score"]) == str(score):
                return "", 204
            models.edit_post(body, score, post_id)
            post = post_dict(models.get_post_by_id(post_id))
            return jsonify({
                "message": "Post edited.",
                "post": post
            }), 200
        except Exception as e:
            print(f"Edit error: {e}")
            return jsonify({
                "error": "Internal Server Error"
            }), 500
        
    # DELETE POST
    if request.method == 'DELETE':
        try: 
            models.delete_post(str(post_id))
            return jsonify({
                "message": "Post deleted.",
            }), 200
        except Exception as e:
            print(f"Delete error: {e}")  # Check logs
            return jsonify({
                "error": "Internal Server Error"
            }), 500
        
# INIT APP
# 
#
def init_app(app):
    app.register_blueprint(bp)
    app.register_blueprint(apibp)
