from flask import Blueprint
from flask import (
    Blueprint, render_template, request
)
from . import models, cache

home_bp = Blueprint('home', __name__)

# MAIN PAGE
# Main page route. Render the main page template.
#
@home_bp.route('/')
def index():
    return render_template("home.html")

# MAIN PAGE
# Main page route. Render the main page template.
#
@home_bp.route('/api/acupdates', methods = ['GET'])
def get_ac_videos():
    key = request.args.get("key")
    maxtime = float(request.args.get("max"))
    response = models.get_cache(key, maxtime)
    
    if response is not None:
        return response
    
    response = models.get_resynced_videos()
    models.set_cache("youtube:ac_black_flag_resynced", response)

    return response


# INIT APP
# 
#
def init_app(app):
    app.register_blueprint(home_bp)