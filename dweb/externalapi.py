from flask import Blueprint
from flask import (
    Blueprint, request, jsonify
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
    response = models.get_jikan_response("/anime", request.args, to_cache=False)
    if response is None:
        return jsonify({
            "error": "Something went wrong."
        }), 500
    elif response.ok:
        return response.json()
    elif response.status_code == 504:
        return jsonify(response.json()), 504
    elif response.status_code == 429:
        return jsonify(response.json()), 429
    else:
        return jsonify({
            "error": "Something went wrong."
        }), 500

@external_apibp.route('/maltitlesearch',  methods = ['GET'])
@login_required_api
def mal_title_search():
    response = models.get_mal_response("/anime", request.args, to_cache=False)
    if response is None:
        return jsonify({
            "error": "Something went wrong."
        }), 500
    elif response.ok:
        return response.json()
    elif response.status_code == 504:
        return jsonify(response.json()), 504
    elif response.status_code == 429:
        return jsonify(response.json()), 429
    else:
        return jsonify({
            "error": "Something went wrong."
        }), 500


# INIT APP
# Register bps
#
def init_app(app):
    app.register_blueprint(external_apibp)
