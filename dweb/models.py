from . import db
import click

# GET ALL POSTS
# Return posts from the database. The returned list is ordered by the created date.
#
def get_all_posts():
    con = db.get_db()
    cursor = con.cursor()
    cursor.execute('SELECT id, title, body, score, created FROM posts ORDER BY created')
    posts = cursor.fetchall()
    return posts


# GET POST BY ID
# Return a post from the database by id. If the id does not exist, return None.
#
def get_post_by_id(id):
    con = db.get_db()
    cursor = con.cursor()
    cursor.execute('SELECT id, title, body, score, created FROM posts WHERE id = ?', [id])
    post = cursor.fetchone()
    return post

# ADD POST
# Add a post to the database. The post is added with the current date and time.
#
@click.command('add-post')
def add_post_terminal():
    con = db.get_db()
    # cursor = con.cursor()
    title = input("Please enter the title:\n")
    body = input("Please enter the description:\n")
    score = input("Please enter the score:\n")
    sql = ''' INSERT INTO posts(title,body,score)
              VALUES(?,?,?) '''    
    con.execute(sql, [title, body, score])
    con.commit()

# ADD POST
# Add a post to the database. The post is added with the current date and time.
#
def add_post(title, desc, score):
    con = db.get_db()
    sql = ''' INSERT INTO posts(title,body,score)
              VALUES(?,?,?) '''    
    con.execute(sql, [title, desc, score])
    con.commit()

# DELETE POST
# Delete a post from the database by id. If the id does not exist, do nothing.
#
def delete_post(id):
    con = db.get_db()
    sql = ''' DELETE FROM posts
              WHERE id=(?) '''    
    con.execute(sql, [id])
    con.commit()

# EDIT POST
# Edit a post in the database by id. If the id does not exist, do nothing.
#
def edit_post(body, id):
    con = db.get_db()
    sql = ''' 
            UPDATE posts
            SET body = (?)
            WHERE id = (?)
        '''    
    con.execute(sql, (body, id))
    con.commit()

# DELETE POST
# Click command (terminal). Delete a post from the database by id. If the id does not exist, do nothing.
#
@click.command('delete-post')
def delete_post_terminal():
    con = db.get_db()
    id = input("Please enter the id:\n")
    sql = ''' DELETE FROM posts
              WHERE id=(?) '''    
    con.execute(sql, [id])
    con.commit()
    print("Deleted")

# INIT APP   
# Init the app by adding the click commands to the app. This allows us to use the commands in the terminal.
#
def init_app(app):
    app.cli.add_command(add_post_terminal)
    app.cli.add_command(delete_post_terminal)