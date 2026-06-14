from flask import Blueprint
from flask import (
    Blueprint, g, redirect, render_template, request, session, url_for, jsonify
)
from . import models

external_apibp = Blueprint('externalapi', __name__, url_prefix='/api')

# TITLE SEARCH ROUTE
# Return login/register template
#
@external_apibp.route('/jikantitlesearch',  methods = ['GET'])
def jikan_title_search():
    return "hello"

# INIT APP
# Register bps
#
def init_app(app):
    app.register_blueprint(external_apibp)
