from flask import Blueprint
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from . import models

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template("main.html")

@bp.route('/posts',  methods = ['GET', 'POST'])
def posts():
    if request.method == 'GET':
        posts = models.get_all_posts()
        return render_template("posts.html", posts=posts)
    if request.method == 'POST':
        title = request.form['title']
        desc = request.form['description']
        score = request.form['score']
        models.add_post(title, desc, score)
        return redirect(url_for("main.posts"))

@bp.route('/posts/delete/<int:post_id>',  methods = ['POST'])
def deletepost(post_id):
    if request.method == 'POST':
        try:
            models.delete_post(str(post_id))
            return redirect(url_for("main.posts"))
        except Exception as e:
            print(f"Delete error: {e}")  # Check logs
            return 'Internal Server Error', 500

@bp.route('/posts/edit/<int:post_id>',  methods = ['POST'])
def editposts(post_id):
    if request.method == 'POST':
        try:
            # body = request.form[f'editinput-{str(post_id)}']
            # print(body)
            # models.edit_post(post_id, body)
            return redirect(url_for("main.posts"))
        except Exception as e:
            print(f"Edit error: {e}")  # Check logs
            return 'Internal Server Error', 500

def init_app(app):
    app.register_blueprint(bp)
