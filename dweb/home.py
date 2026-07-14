from flask import Blueprint
from flask import (
    Blueprint, render_template, request, jsonify
)
from . import models, cache
from .auth import login_required_api

home_bp = Blueprint('home', __name__)

# # MAIN PAGE
# # Main page route. Render the main page template.
# #
# @home_bp.route('/')
# def index():
#     return render_template("home.html")

# MAIN PAGE
# Call the youtube api to get video updates
# Needs a q argument for the search and max for maximum age in seconds
@home_bp.route('/api/videoupdates', methods = ['GET'])
@login_required_api
def get_update_videos():
    key = request.args.get("key")
    try:
        maxtime = float(request.args.get("max"))
    except ValueError:
        return jsonify({
            "error": "Must be a valid nonnegative number."
        })
    response = models.get_cache(key, maxtime)
    
    if maxtime < 0:
        return jsonify({
            "error": "Must be a valid nonnegative number."
        })

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