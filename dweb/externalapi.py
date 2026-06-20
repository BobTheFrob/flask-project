from flask import Blueprint
from flask import (
    Blueprint, g, redirect, render_template, request, session, url_for, jsonify
)
from . import models
from .auth import login_required_api

external_apibp = Blueprint('externalapi', __name__, url_prefix='/api')

# TITLE SEARCH ROUTE
# Return anime based on query parameters
#
@external_apibp.route('/jikantitlesearch',  methods = ['GET'])
@login_required_api
def jikan_title_search():
    return models.get_jikan_response("/anime", request.args, to_cache=False)

# INIT APP
# Register bps
#
def init_app(app):
    app.register_blueprint(external_apibp)
