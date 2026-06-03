from flask import Blueprint
import sqlite3
from flask import (
    Blueprint, g, redirect, render_template, request, session, url_for, jsonify
)
import functools
from werkzeug.security import check_password_hash, generate_password_hash
from . import models

authbp = Blueprint('auth', __name__, url_prefix='/auth')
auth_apibp = Blueprint('authapi', __name__, url_prefix='/api')

# LOGIN ROUTE
# Return login/register template
#
@authbp.route('/login',  methods = ['GET'])
def login_page():
    return render_template("login.html")

# VALIDATE DATA
# Return validated data or message from json
#
def validateUserDetails(data):
    username = (data.get('username') or "").strip().casefold()
    password = (data.get('password') or "")
    if (username and password):
        return {
            "username": username,
            "password": password
        }
    elif (not username):
        return {"error": "Must have a username."}
    elif (not password):
        return {"error": "Must have a password."}

# REGISTER API
# Register and add to models
#
@auth_apibp.route('/register', methods = ['POST'])
def register():
    session.clear()
    data = request.get_json() or {}
    userData = validateUserDetails(data)
    userData["password"] = generate_password_hash(userData["password"])
    if (userData.get("error")):
        return jsonify({
            "error": userData.get("error")
        }), 400
    else:
        try:
            models.register_user(userData)
        except sqlite3.IntegrityError:
            return jsonify({"error": "Username already exists."}), 409
        except Exception:
            return jsonify({"error": "Registration failed."}), 500
    return jsonify({"message": "User registered successfully."}), 201

# LOGIN API
# Login and get data from models
#
@auth_apibp.route('/login', methods = ['POST'])
def login():
    data = request.get_json() or {}
    userData = validateUserDetails(data)
    if (userData.get("error")):
        return jsonify({
            "error": userData.get("error")
        }), 400
    userSearched = models.login_user(userData)
    if userSearched is None or not check_password_hash(userSearched['password'], userData['password']):
        return jsonify({
            "error": "Incorrect username/password."
        }), 400
    session.clear()
    session['user_id'] = userSearched['id']
    session.permanent = True
    return jsonify({
        "message": "Logged in."
    }), 200

@auth_apibp.route('/me', methods = ['GET'])
def me():
    x = session.get("user_id")
    y = g.user["username"]
    return jsonify({
        "message": x,
        "message2": y
    }), 200

# LOGIN FOR EVERY REQUEST
# Call flask decorator everytime a request is made
#
@auth_apibp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = models.get_user_by_id({"id": user_id})

# LOGOUT API
# Logout and clear session
#
@auth_apibp.route("/logout", methods = ['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out."})

# LOGIN REQUIRED DECORATOR
# For api
#
def login_required_api(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return jsonify({
                "error": "Authentication required"
            }), 401

        return view(**kwargs)

    return wrapped_view

# LOGIN REQUIRED DECORATOR
# For pages
#
def login_required_page(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("auth.login_page"))

        return view(**kwargs)

    return wrapped_view

# INIT APP
# Register bps
#
def init_app(app):
    app.register_blueprint(authbp)
    app.register_blueprint(auth_apibp)
