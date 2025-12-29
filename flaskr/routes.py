from flask import Blueprint

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return 'Index Page'

@bp.route('/hello')
def hello():
    return 'Hello World!'

def init_app(app):
    app.register_blueprint(bp)
