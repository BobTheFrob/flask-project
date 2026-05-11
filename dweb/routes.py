from flask import Blueprint
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
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
def posts():
    if request.method == 'GET':
        posts = models.get_all_posts()
        return render_template("posts.html", posts=posts)
    if request.method == 'POST':
        title = request.form['title']
        desc = request.form['description']
        score = request.form['score']
        if not title.strip() or not score.strip():
            posts = models.get_all_posts()
            return render_template(
                "posts.html",
                posts=posts,
                error="Post cannot be empty."
            )
        models.add_post(title, desc, score)
        return redirect(url_for("main.posts"))

# DELETE POST
# Delete post route. If the request method is POST, delete the post from the database and redirect to the posts page.
#
@bp.route('/posts/delete/<int:post_id>',  methods = ['POST'])
def deletepost(post_id):
    if request.method == 'POST':
        try:
            models.delete_post(str(post_id))
            return redirect(url_for("main.posts"))
        except Exception as e:
            print(f"Delete error: {e}")  # Check logs
            return 'Internal Server Error', 500

# EDIT POST
# Edit post route. If the request method is POST, edit the post in the database and redirect to the posts page.
#
@bp.route('/posts/edit/<int:post_id>', methods=['POST'])
def editposts(post_id):
    try:
        body = request.form[f'editinput-{post_id}']
        models.edit_post(body, post_id)
        return redirect(url_for("main.posts"))

    except Exception as e:
        print(f"Edit error: {e}")
        return f'Internal Server Error: {e}', 500
    
# INIT APP
# 
#
def init_app(app):
    app.register_blueprint(bp)
