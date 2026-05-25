from . import db
import click

# GET ALL POSTS
# Return posts from the database. The returned list is ordered by the created date.
#
def get_all_posts():
    con = db.get_db()
    cursor = con.cursor()
    cursor.execute('SELECT id, title, body, score, watchingStatus, animeType, created FROM posts ORDER BY created')
    posts = cursor.fetchall()
    return posts


# GET POST BY ID
# Return a post from the database by id. If the id does not exist, return None.
#
def get_post_by_id(id):
    con = db.get_db()
    cursor = con.cursor()
    cursor.execute('SELECT id, title, body, score, watchingStatus, animeType, created FROM posts WHERE id = ?', [id])
    post = cursor.fetchone()
    return post

# ADD POST
# Add a post to the database. The post is added with the current date and time.
#
def add_post(post):
    con = db.get_db()
    sql = ''' INSERT INTO posts(title,body,score,watchingStatus,animeType)
              VALUES(?,?,?,?,?) '''    
    cursor = con.execute(sql, [post['title'], post['body'], post['score'], post['watchingStatus'], post['animeType']])
    new_id = cursor.lastrowid
    con.commit()
    return new_id

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
def edit_post(post):
    con = db.get_db()
    sql = ''' 
            UPDATE posts
            SET body = (?),
            score = (?),
            watchingStatus = (?),
            animeType = (?)
            WHERE id = (?)
        '''    
    con.execute(sql, [post['body'], post['score'], post['watchingStatus'], post['animeType'], post['id']])
    con.commit()
