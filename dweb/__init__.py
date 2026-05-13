import os
from flask import Flask
from . import routes


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='devd',
        DATABASE=os.path.join(app.instance_path, 'dweb.sqlite'),
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

    routes.init_app(app)

    from . import db
    db.init_app(app)
    from . import models
    models.init_app(app)

    return app