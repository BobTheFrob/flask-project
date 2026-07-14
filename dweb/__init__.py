import os
from flask import Flask, send_from_directory
from flask_caching import Cache
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

cache = Cache(config=
    {'CACHE_TYPE': "SimpleCache",
    'CACHE_DEFAULT_TIMEOUT': 3600
})

DIST_DIR = Path(__file__).resolve().parent.parent / "frontend" / "dist"

def create_app(test_config = None):
    app = Flask(
        __name__,
        static_folder=str(DIST_DIR / "assets"),
        static_url_path="/assets",
    )
    app.config.from_mapping(
        SECRET_KEY=os.getenv("APP_SECRET_KEY"),
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

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        requested = DIST_DIR / path

        if path and requested.is_file():
            return send_from_directory(DIST_DIR, path)

        return send_from_directory(DIST_DIR, "index.html")

    return app