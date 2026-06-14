import os
from flask import Flask
from flask_caching import Cache
from dotenv import load_dotenv

load_dotenv()

cache = Cache(config=
    {'CACHE_TYPE': "SimpleCache",
    'CACHE_DEFAULT_TIMEOUT': 3600
})

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=os.getenv("APP_SECRET_KEY"),
        DATABASE=os.path.join(app.instance_path, 'dweb.sqlite')
    )
    app.json.sort_keys = False
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    cache.init_app(app)
    from . import auth, posts, home, externalapi
    posts.init_app(app)
    auth.init_app(app)
    home.init_app(app)
    externalapi.init_app(app)

    from . import db
    db.init_app(app)

    return app