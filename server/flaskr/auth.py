import functools
import jwt
import datetime
import re

from flask import Blueprint, request, jsonify, g
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from flaskr.db import get_db

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

bp = Blueprint('auth', __name__, url_prefix='/auth')
CORS(bp, supports_credentials=True)

def generate_jwt(user_id, username):
    payload = {
        "user_id": user_id,
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_jwt(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}, 401

@bp.route('/register', methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data:
            return {"error": "Invalid input"}, 400
                
        username = data.get('username')
        password = data.get('password')
        db = get_db()
        error = None

        if not username:
            error = 'Username is required.'
        elif len(username) < 3:
            error = 'Username must be at least 3 characters long.'
        elif not username.isalnum():
            error = 'Username can only contain letters and numbers.'

        if not password:
            error = 'Password is required.'
        elif len(password) < 6:
            error = 'Password must be at least 6 characters long.'
        elif not re.search(r'[A-Z]', password):
            error = 'Password must contain at least one uppercase letter.'
        elif not re.search(r'[a-z]', password):
            error = 'Password must contain at least one lowercase letter.'
        elif not re.search(r'[0-9]', password):
            error = 'Password must contain at least one digit.'

        if error is None:
            try:
                db.execute(
                    "INSERT INTO user (username, password) VALUES (?, ?)",
                    (username, generate_password_hash(password, method='pbkdf2:sha256')),
                )
                db.commit()
                return {'message': 'Registered successfully'}, 201
            except db.IntegrityError:
                error = f"User {username} is already registered."

        return {"error": error}, 400

    except Exception as e:
        print(f"Error: {e}")
        return {"error": "An unexpected error occurred."}, 500


@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return {"error": "Invalid input"}, 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {"error": "Username and password are required."}, 400

        db = get_db()
        user = db.execute(
            "SELECT * FROM user WHERE username = ?", (username,)
        ).fetchone()

        if user and check_password_hash(user['password'], password):
            token = generate_jwt(user['id'], user['username'])
            return {"message": "Login successful", "token": token}, 200
        else:
            return {"error": "Invalid username or password"}, 401

    except Exception as e:
        print(f"Error during login: {e}")
        return {"error": "An unexpected error occurred."}, 500


@bp.route('/invest', methods=['POST'])
def invest():
    try:
        data = request.get_json()
        if not data:
            return {"error": "Invalid input"}, 400

        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return {"error": "Missing token"}, 401

        token = auth_header.split(" ")[1]
        decoded = decode_jwt(token)
        if isinstance(decoded, tuple):
            return decoded

        user_id = decoded.get("user_id")
        fund = data.get("fund")
        amount = data.get("amount")

        if not fund or not amount:
            return {"error": "Fund and amount are required."}, 400

        db = get_db()
        user = db.execute("SELECT cash FROM user WHERE id = ?", (user_id,)).fetchone()

        if not user:
            return {"error": "User not found."}, 404

        balance = user["cash"]

        if amount > balance:
            return {"error": "Insufficient funds."}, 400

        db.execute("UPDATE user SET cash = cash - ? WHERE id = ?", (amount, user_id))

        db.execute(
            "INSERT INTO history (user_id, fund) VALUES (?, ?)",
            (user_id, fund)
        )

        db.commit()
        return {"message": "Investment successful."}, 201

    except Exception as e:
        print(f"Error during investment: {e}")
        return {"error": "An unexpected error occurred."}, 500
