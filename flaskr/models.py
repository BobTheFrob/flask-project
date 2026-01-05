from . import db
import click


def get_all_posts():
    con = db.get_db()
    cursor = con.cursor()
    cursor.execute('SELECT id, title, body, score, created FROM posts ORDER BY created')
    posts = cursor.fetchall()

    # turn it into a string for now (just for testing)
    # result = ""
    # for post in posts:
    #     result += f"<p>{post['id']}: {post['title']} ({post['score']}/10) - {post['body']} ({post['created']})</p>"
    return posts

@click.command('add-post')
def add_post_terminal():
    con = db.get_db()
    # cursor = con.cursor()
    title = input("Please enter the title:\n")
    body = input("Please enter the description:\n")
    score = input("Please enter the score:\n")
    sql = ''' INSERT INTO posts(title,body,score)
              VALUES(?,?,?) '''    
    con.execute(sql, (title, body, score))
    con.commit()

def add_post(title, desc, score):
    con = db.get_db()
    sql = ''' INSERT INTO posts(title,body,score)
              VALUES(?,?,?) '''    
    con.execute(sql, (title, desc, score))
    con.commit()

def delete_post(id):
    con = db.get_db()
    sql = ''' DELETE FROM posts
              WHERE id=(?) '''    
    con.execute(sql, (id))
    con.commit()

@click.command('delete-post')
def delete_post_terminal():
    con = db.get_db()
    id = input("Please enter the id:\n")
    sql = ''' DELETE FROM posts
              WHERE id=(?) '''    
    con.execute(sql, (id))
    con.commit()
    print("Deleted")


def init_app(app):
    app.cli.add_command(add_post_terminal)
    app.cli.add_command(delete_post_terminal)