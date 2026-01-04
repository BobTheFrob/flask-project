from flask import Blueprint
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from . import models

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template("main.html")

@bp.route('/posts',  methods = ['GET', 'POST', 'DELETE'])
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
        if request.method == 'DELETE':
            pass
        else:
            pass

def init_app(app):
    app.register_blueprint(bp)
