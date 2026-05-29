from flask import Blueprint
from flask import (
    Blueprint, g, redirect, render_template, request, session, url_for, jsonify
)
from . import models

authbp = Blueprint('auth', __name__, url_prefix='/auth')
auth_apibp = Blueprint('authapi', __name__, url_prefix='/api')

# LOGIN
# Return login/register template
#
@authbp.route('/login',  methods = ['GET'])
def login_page():
    return render_template("login.html")


def validateUserRegisterData(data):
    username = (data.get('username') or "").strip().casefold()
    password = (data.get('password') or "").strip()
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
    if request.method == 'POST':
        data = request.get_json() or {}
        userData = validateUserRegisterData(data)
        if (userData.get("error")):
            return jsonify({
                "error": userData.get("error")
            })
        
            # if not username:
            #     error = 'Username is required.'
            # elif not password:
            #     error = 'Password is required.'

            # if error is None:
            #     try:
            #         db.execute(
            #             "INSERT INTO user (username, password) VALUES (?, ?)",
            #             (username, generate_password_hash(password)),
            #         )
            #         db.commit()
            #     except db.IntegrityError:
            #         error = f"User {username} is already registered."
            #     else:
            #         return redirect(url_for("auth.login"))

            # flash(error)


# @apibp.route('/login', methods = ['POST'])
# def login():



# INIT APP
# Register bp
#
def init_app(app):
    app.register_blueprint(authbp)
    app.register_blueprint(auth_apibp)
