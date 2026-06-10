from . import db, cache
import json, time

####_____________________________####
####                             ####
####            POSTS            ####
####_____________________________#### 

# GET ALL POSTS
# Return posts from the database. The returned list is ordered by the created date.
#
def get_all_posts(user_id):
    con = db.get_db()
    posts = con.execute("""
        SELECT *
        FROM posts
        JOIN users
            ON posts.user_id = users.id
        WHERE posts.user_id = ?
        ORDER BY created
    """, [user_id]).fetchall()
    return posts


# GET POST BY ID
# Return a post from the database by id. If the id does not exist, return None.
#
def get_post_by_id(user_id ,id):
    con = db.get_db()
    cursor = con.cursor()
    sql = '''
    SELECT * FROM posts         
    JOIN users
        ON posts.user_id = users.id
    WHERE posts.user_id = ?
    AND posts.id = ?
    '''
    cursor.execute(sql, [user_id, id])
    post = cursor.fetchone()
    return post

# ADD POST
# Add a post to the database. The post is added with the current date and time.
#
def add_post(post):
    con = db.get_db()
    sql = """
    INSERT INTO posts(
        title,
        body,
        score,
        watchingStatus,
        animeType,
        user_id
    )
    VALUES(
        :title,
        :body,
        :score,
        :watchingStatus,
        :animeType,
        :user_id
    )
    """   
    cursor = con.execute(sql, post)
    new_id = cursor.lastrowid
    con.commit()
    return new_id

# DELETE POST
# Delete a post from the database by id. If the id does not exist, do nothing.
#
def delete_post(user_id, id):
    con = db.get_db()
    sql = ''' DELETE FROM posts
              WHERE user_id=(?) AND id=(?)'''    
    con.execute(sql, [user_id, id])
    con.commit()

# EDIT POST
# Edit a post in the database by id. If the id does not exist, do nothing.
#
def edit_post(post):
    con = db.get_db()
    sql = ''' 
        UPDATE posts
        SET
            body = :body,
            score = :score,
            watchingStatus = :watchingStatus,
            animeType = :animeType
        WHERE user_id = :user_id
        AND id = :id
        '''    
    con.execute(sql, post)
    con.commit()

####_____________________________####
####                             ####
####            USERS            ####
####_____________________________#### 

# REGISTER USER
# Pass user data to insert into users table
#
def register_user(userData):
    con = db.get_db()
    sql = ''' INSERT INTO users(username, password)
              VALUES(?,?) '''    
    cursor = con.execute(sql, [userData['username'], userData['password']])
    new_id = cursor.lastrowid
    con.commit()
    return new_id

# LOGIN USER
# Pass user id to fetch user from users table
#
def get_user_by_id(userData):
    con = db.get_db()
    cursor = con.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', [userData['id']])
    user = cursor.fetchone()
    return user

# LOGIN USER
# Pass user data to fetch user from users table
#
def login_user(userData):
    con = db.get_db()
    cursor = con.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', [userData['username']])
    user = cursor.fetchone()
    return user

@cache.memoize(120)
def get_cache(key, max_age_seconds):
    con = db.get_db()

    row = con.execute(
        "SELECT response_json, created FROM api_cache WHERE cache_key = ?",
        (key,)
    ).fetchone()

    if row is None:
        return None

    age = time.time() - row["created"]

    if age > max_age_seconds:
        return None

    return json.loads(row["response_json"])


def set_cache(key, data):
    con = db.get_db()

    con.execute("""
        INSERT INTO api_cache (cache_key, response_json, created)
        VALUES (?, ?, ?)
        ON CONFLICT(cache_key) DO UPDATE SET
            response_json = exc luded.response_json,
            created = excluded.created
    """, (
        key,
        json.dumps(data),
        int(time.time())
    ))

    con.commit()