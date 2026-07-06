from . import db, cache
import json, time, os
import requests
from datetime import datetime, timedelta, timezone
import os, dotenv
####_____________________________####
####                             ####
####            POSTS            ####
####_____________________________#### 

# GET ALL POSTS
# Return posts from the database. The returned list is ordered by the created date.
#
def get_all_posts(user_id):
    with db.get_cursor() as cur:
        cur.execute("""
        SELECT
            posts.id AS id,
            posts.mal_id,
            posts.user_id,
            posts.created,
            posts.title,
            posts.body,
            posts.score,
            posts.watching_status,
            posts.anime_type,
            posts.image_url,
            posts.watch_link,
            users.username
        FROM posts
        JOIN users
            ON posts.user_id = users.id
        WHERE posts.user_id = %s
        ORDER BY posts.created DESC
        """, (user_id, ))
        return cur.fetchall()


# GET POST BY ID
# Return a post from the database by id. If the id does not exist, return None.
#
def get_post_by_id(user_id, post_id):
    with db.get_cursor() as cur:
        sql = """
        SELECT
            posts.id AS id,
            posts.mal_id,
            posts.user_id,
            posts.created,
            posts.title,
            posts.body,
            posts.score,
            posts.watching_status,
            posts.anime_type,
            posts.image_url,
            posts.watch_link,
            users.username
        FROM posts
        JOIN users
            ON posts.user_id = users.id
        WHERE posts.user_id = %s
        AND posts.id = %s
        ORDER BY posts.created
        """
        cur.execute(sql, (user_id, post_id))
        return cur.fetchone()

# ADD POST
# Add a post to the database. The post is added with the current date and time.
#
def add_post(post):
    con = db.get_db()
    sql = """
    INSERT INTO posts (
        title,
        body,
        score,
        watching_status,
        anime_type,
        user_id,
        mal_id,
        image_url,
        watch_link
    )
    VALUES (
        %(title)s,
        %(body)s,
        %(score)s,
        %(watching_status)s,
        %(anime_type)s,
        %(user_id)s,
        %(mal_id)s,
        %(image_url)s,
        %(watch_link)s
    )
    RETURNING id
    """
    with db.get_cursor() as cur:
        cur.execute(sql, post)
        new_id = cur.fetchone()["id"]
        con.commit()
        return new_id

# DELETE POST
# Delete a post from the database by id. If the id does not exist, do nothing.
#
def delete_post(user_id, post_id):
    con = db.get_db()
    sql = ''' DELETE FROM posts
              WHERE user_id=%s AND id=%s'''    
    with db.get_cursor() as cur:
        cur.execute(sql, (user_id, post_id))
        con.commit()

# EDIT POST
# Edit a post in the database by id. If the id does not exist, do nothing.
#
def edit_post(post):
    con = db.get_db()
    sql = ''' 
        UPDATE posts
        SET
            title = %(title)s,
            body = %(body)s,
            score = %(score)s,
            watching_status = %(watching_status)s,
            anime_type = %(anime_type)s,
            mal_id = %(mal_id)s,
            image_url = %(image_url)s,
            watch_link = %(watch_link)s
        WHERE user_id = %(user_id)s
        AND id = %(id)s
        '''    
    with db.get_cursor() as cur:
        cur.execute(sql, post)
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
              VALUES(%s,%s) RETURNING id'''
    with db.get_cursor() as cur:    
        cur.execute(sql, (userData['username'], userData['password']))
        new_id = cur.fetchone()["id"]
        con.commit()
        return new_id

# LOGIN USER
# Pass user id to fetch user from users table
#
def get_user_by_id(userData):
    con = db.get_db()
    with db.get_cursor() as cur:
        cur.execute('SELECT * FROM users WHERE id = %s', (userData['id'], ))
        return cur.fetchone()

# LOGIN USER
# Pass user data to fetch user from users table
#
def login_user(userData):
    with db.get_cursor() as cur:
        cur.execute('SELECT * FROM users WHERE username = %s', (userData['username'], ))
        return cur.fetchone()

####___________________________________________####
####                                           ####
####            EXTERNAL AND CACHE             ####
####___________________________________________####

def get_youtube_videos(query):
    two_days_ago = (datetime.now(timezone.utc) 
    - timedelta(days=2)).isoformat().replace("+00:00", "Z")
    response = requests.get(
        "https://www.googleapis.com/youtube/v3/search",
        params={
            "part": "snippet",
            "q": query,
            "maxResults": 6,
            "type": "video",
            "publishedAfter": two_days_ago,
            "key": os.getenv("YOUTUBE_API_KEY")
        }
    )
    return response.json()

def clearOldCache(api_name, seconds):
    age = time.time() - seconds
    con = db.get_db()
    with db.get_cursor() as cur:
        cur.execute(
            "DELETE FROM api_cache WHERE cache_key LIKE %s AND created < %s",
            (f"{api_name}:%", age)
        )
        con.commit()

@cache.memoize(1800)
def get_cache(key, max_age_seconds):
    with db.get_cursor() as cur:
        cur.execute(
            "SELECT response_json, created FROM api_cache WHERE cache_key = %s",
            (key, )
        )
        row = cur.fetchone()
        if row is None:
            return None

        age = time.time() - row["created"]
        if age > max_age_seconds:
            return None

        return json.loads(row["response_json"])


def set_cache(key, data):
    con = db.get_db()
    
    # TODO Delete this and make it a background worker process thing. Currently deletes all api_caches after a day when another cache is set.
    api_name = key.split(':')[0]
    clearOldCache(api_name, 86400)

    with db.get_cursor() as cur:
        cur.execute("""
            INSERT INTO api_cache (cache_key, response_json, created)
            VALUES (%s, %s, %s)
            ON CONFLICT(cache_key) DO UPDATE SET
                response_json = excluded.response_json,
                created = excluded.created
        """, (  
            key,
            json.dumps(data),
            int(time.time())
        ))

        con.commit()

def make_cache_key(api_name, path, params=None):
    params = params or {}
    stable_params = json.dumps(params, sort_keys=True)
    return f"{api_name}:{path}:{stable_params}"

@cache.memoize(86400)
def get_jikan_response(path: str, params: dict | None = None, to_cache = True):
    JIKAN_BASE_URL = "https://api.jikan.moe/v4"
    if params:
        params = {
            k.lower(): v.lower() if isinstance(v, str) else v
            for k, v in params.items()
        }
    
    cache_key = make_cache_key("jikan", path, params)
    cached = get_cache(cache_key, max_age_seconds=86400)
    if cached is not None:
        return cached
    try:
        response = requests.get(
            f"{JIKAN_BASE_URL}{path}",
            params=params,
            timeout=10
        )
    except requests.exceptions.RequestException as e: 
        print(e)
        return None
    if (response.ok):
        data = response.json()

        if to_cache:
            set_cache(cache_key, data)
    return response

@cache.memoize(86400)
def get_mal_response(path: str, params: dict | None = None, to_cache = True):
    MAL_API_BASE_URL = "https://api.myanimelist.net/v2/"
    if params:
        params = {
            k.lower(): v.lower() if isinstance(v, str) else v
            for k, v in params.items()
        }
    
    cache_key = make_cache_key("mal_api", path, params)
    cached = get_cache(cache_key, max_age_seconds=86400)
    if cached is not None:
        return cached
    try:
        response = requests.get(
            f"{MAL_API_BASE_URL}{path}",
            params=params,
            timeout=10,
            headers={
                "X-MAL-CLIENT-ID": os.getenv("MAL_CLIENT_ID")
            }
        )
    except requests.exceptions.RequestException as e: 
        print(e)
        return None
    if (response.ok):
        data = response.json()

        if to_cache:
            set_cache(cache_key, data)
    return response