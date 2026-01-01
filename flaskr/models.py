from . import db
import click


def get_all_posts():
    con = db.get_db()
    cursor = con.cursor()
    cursor.execute('SELECT id, title, body, score, created FROM posts ORDER BY created')
    posts = cursor.fetchall()

    # turn it into a string for now (just for testing)
    result = ""
    for post in posts:
        result += f"<p>{post['id']}: {post['title']} ({post['score']}/10) - {post['body']} ({post['created']})</p>"
    return result

@click.command('add-post')
def add_post():
    con = db.get_db()
    # cursor = con.cursor()
    title = input("Please enter the title:\n")
    body = input("Please enter the description:\n")
    score = input("Please enter the score:\n")
    sql = ''' INSERT INTO posts(title,body,score)
              VALUES(?,?,?) '''    
    con.execute(sql, (title, body, score))
    con.commit()

def init_app(app):
    app.cli.add_command(add_post)