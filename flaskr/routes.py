from flask import Blueprint
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from . import models

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return 'Index Page'

@bp.route('/hello')
def hello():
    return 'Hello World!'

@bp.route('/posts',  methods = ['GET', 'POST', 'DELETE'])
def update_text():
        if request.method == 'GET':
            return render_template("posts.html")
        if request.method == 'POST':
            return "post created!"
        if request.method == 'DELETE':
            pass
        else:
            pass

def init_app(app):
    app.register_blueprint(bp)
