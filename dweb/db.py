import sqlite3
from datetime import datetime

import click
from flask import current_app, g

# DATABASE
# Database connection and initialization functions. The database is a SQLite database.
# The database file is specified in the app configuration. The database is initialized with the schema.sql file.
# The database connection is closed when the app context is torn down. The database connection is stored in the g object, 
# which is a global object that is unique to each request. This allows us to reuse the same database connection throughout the request.
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

        g.db.execute("PRAGMA foreign_keys = ON")

    return g.db

# CLOSE DB
# Close the database connection. This function is called when the app context is torn down. The database connection is closed and removed from the g object.  
#
def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()

# INIT DB
# Initialize the database. This function is called when the init-db command is executed. The database is initialized with the schema.sql file.
#
def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

# INIT DB COMMAND
# Click command (terminal). Initialize the database. This command is executed by running the following command in the terminal: flask --app dweb init-db.
#
@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

# CLEAR DB COMMAND
# Click command (terminal). Clear the existing data. This command is executed by running the following command in the terminal: flask --app dweb clear-db.
#
@click.command('clear-db')
def clear_db_command():
    """Clear the existing data."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('DROP TABLE IF EXISTS posts')
    init_db()
    click.echo('Cleared the database.')

# TIMESTAMP CONVERTER
# Register a converter for the timestamp type. This allows us to store and retrieve datetime objects in the database.
# The converter converts the datetime object to a string when storing it in the database,
# and converts the string back to a datetime object when retrieving it from the database.
# The string format is ISO 8601, which is a standard format for representing date and time.
# The converter is registered with the name "timestamp", which allows us to use it in the schema.sql file when defining the posts table.
#
sqlite3.register_converter(
    "timestamp", lambda v: datetime.fromisoformat(v.decode())
)

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(clear_db_command)