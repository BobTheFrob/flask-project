from flask import Blueprint
from flask import (
    Blueprint, g, redirect, render_template, request, session, url_for, jsonify
)
from . import models

bp = Blueprint('auth', __name__, url_prefix='/auth')

# LOGIN
# 
#
@bp.route('/posts',  methods = ['GET', 'POST'])
def login_page():
    if request.method == 'GET':
        return render_template("login.html")

# INIT APP
# 
#
def init_app(app):
    app.register_blueprint(bp)
