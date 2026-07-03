import click
from flask import current_app, g
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
import os

# DATABASE
# Database connection and initialization functions.
def get_db():
    if 'db' not in g:
        g.db = psycopg2.connect(database=os.getenv("DATABASE"), user=os.getenv("DATABASE_USER"), 
                                password=os.getenv("DATABASE_PW"), host=os.getenv("DATABASE_HOST"), port=os.getenv("DATABASE_PORT"))
    return g.db

def get_cursor():
    return get_db().cursor(cursor_factory=psycopg2.extras.RealDictCursor)

# CLOSE DB
# Close the database connection. This function is called when the app context is torn down. The database connection is closed and removed from the g object.
def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()

# INIT DB
# Initialize the database. This function is called when the init-db command is executed. The database is initialized with the schema.sql file.
#
def init_db():
    conn = get_db()
    cur = conn.cursor()

    with current_app.open_resource("schema.sql") as f:
        cur.execute(f.read().decode("utf8"))

    conn.commit()
    # cur.close()

# INIT DB COMMAND
# Click command (terminal). Initialize the database. This command is executed by running the following command in the terminal: flask --app dweb init-db.
#
@click.command('init-db')
def init_db_command():
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
    cursor.execute('DROP TABLE IF EXISTS users')
    init_db()
    click.echo('Cleared the database.')

# CLEAR DB COMMAND
# Click command (terminal). Update the existing data with updateschema.sql. 
# This command is executed by running the following command in the terminal: flask --app dweb update-db.
#
@click.command('update-db')
def update_db_command():
    """Update the db with updateschema script."""
    conn = get_db()
    cur = conn.cursor()

    with current_app.open_resource("updateschema.sql") as f:
        cur.execute(f.read().decode("utf8"))

    conn.commit()

    click.echo("Database upgraded.")

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(clear_db_command)
    app.cli.add_command(update_db_command)