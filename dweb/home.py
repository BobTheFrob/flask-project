from flask import Blueprint
from flask import (
    Blueprint, render_template
)
from . import models, cache

home_bp = Blueprint('home', __name__)

# MAIN PAGE
# Main page route. Render the main page template.
#
@home_bp.route('/')
def index():
    return render_template("home.html")

# INIT APP
# 
#
def init_app(app):
    app.register_blueprint(home_bp)