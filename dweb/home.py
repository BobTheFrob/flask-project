from flask import Blueprint
from flask import (
    Blueprint, render_template, request, jsonify
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
@home_bp.route('/api/videoupdates', methods = ['GET'])
def get_update_videos():
    key = request.args.get("key")
    maxtime = float(request.args.get("max"))
    response = models.get_cache(key, maxtime)
    
    if not key.split(':')[1] or not key.split(':')[0]:
        return jsonify({
            "error": "Invalid query type."
        })

    if response is not None:
        return response
    
    response = models.get_youtube_videos(key.split(':')[1])
    models.set_cache(key, response)

    return response


# INIT APP
# 
#
def init_app(app):
    app.register_blueprint(home_bp)