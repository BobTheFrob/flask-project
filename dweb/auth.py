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

# LOGIN
# Return login/register template
#
@authbp.route('/login',  methods = ['GET'])
def login_page():
    return render_template("login.html")


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

@auth_apibp.route('/login', methods = ['POST'])
def login():
    data = request.get_json() or {}
    userData = validateUserDetails(data)
    if (userData.get("error")):
        return jsonify({
            "error": userData.get("error")
        }), 400
    userSearched = models.login_user(userData)
    if userSearched is None:
        return jsonify({
            "error": "Incorrect username/password."
        }), 400
    elif not check_password_hash(userSearched['password'], userData['password']):
        return jsonify({
            "error": "Incorrect username/password."
        }), 400
    session.clear()
    session['user_id'] = userSearched['id']
    session.permanent = True
    return jsonify({
        "message": "Logged in."
    }), 200
    # return redirect(url_for('index'))

    #     flash(error)

    # return render_template('auth/login.html')
@auth_apibp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = models.get_user_by_id({"id": user_id})

@auth_apibp.route("/logout", methods = ['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out."})

@auth_apibp.get("/me")
def me():
    if g.user is None:
        return jsonify({"error": "Not logged in"}), 401
    
    return {
        "user": g.user["username"]
    }

def login_required_api(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return jsonify({
                "error": "Authentication required"
            }), 401

        return view(**kwargs)

    return wrapped_view

def login_required_page(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        print("DECORATOR g.user:", g.user)

        if g.user is None:
            return redirect(url_for("auth.login_page"))

        return view(**kwargs)

    return wrapped_view

# INIT APP
# Register bp
#
def init_app(app):
    app.register_blueprint(authbp)
    app.register_blueprint(auth_apibp)
