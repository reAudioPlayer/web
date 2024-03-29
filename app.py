"""Python Flask WebApp Auth0 integration example
"""

import json
from time import time
from userModel import UserModel
from spotipy import Spotify
from os import environ as env
from urllib.parse import quote_plus, urlencode

from hashids import Hashids

from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from flask import Flask, send_file, redirect, send_from_directory, session, request, jsonify, Response

from werkzeug.serving import run_simple
from werkzeug.middleware.dispatcher import DispatcherMiddleware

import mimetypes

from flask_cors import cross_origin

from meta.releases import Releases
from meta.metadata import Metadata
from dataModels.track import SpotifyTrack

mimetypes.init()
mimetypes.types_map['.js'] = 'application/javascript; charset=utf-8'

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)
app.secret_key = env.get("APP_SECRET_KEY")

ranHashids = Hashids(str(time()), 10)

UserModel.create_table(read_capacity_units=1, write_capacity_units=1)

oauth = OAuth(app)

oauth.register(
    "auth0",
    client_id=env.get("AUTH0_CLIENT_ID"),
    client_secret=env.get("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration',
)

# Controllers API

@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    return redirect("/")

@app.route("/login")
def login():
    return oauth.auth0.authorize_redirect(
        redirect_uri = "https://reaudioplayer.tk/callback"
    )

@app.route("/logout")
def logout():
    session.clear()
    return redirect(
        "https://" + env.get("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": "https://reaudioplayer.tk/",
                "client_id": env.get("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )

@app.route("/spotify/album", methods = ["POST"])
def spotifyAlbum():
    token = request.json.get("accessToken")
    spotify = Spotify(token)
    tracks = SpotifyTrack.FromAlbum(spotify, request.json.get("albumId"))
    metadatas = [ Metadata(spotify, track.url) for track in tracks ]    
    return jsonify([ metadata.toDict() for metadata in metadatas ])

@app.route("/spotify/releaseRadar", methods = ["POST"])
def releases():
    token = request.json.get("accessToken")
    spotify = Spotify(token)
    return jsonify(Releases(spotify).toDict())

__accessTokens = { }

@app.route("/user/accessToken")
def getAccessToken():
    user = session.get("user")
    redirectTo = request.args.get('redirect')

    if None in (user, redirectTo) or "<token>" not in redirectTo:
        return redirect("/login")

    find = next((token for (token, val) in __accessTokens.items() if val["access_token"] == user["access_token"]), None)
    if find:
        return redirect(redirectTo.replace("<token>", find))

    token = ranHashids.encode(len(__accessTokens.values()))
    __accessTokens[token] = user
    return redirect(redirectTo.replace("<token>", token))

@app.route("/user/<accessToken>", methods = ["GET", "POST"])
@cross_origin()
def updateUserData(accessToken: str):
    if not accessToken in __accessTokens:
        return Response(status = 401)
    user = __accessTokens[accessToken]

    if request.method == "GET":
        return prepareUserWithData(user)

    _updateUserData(user, request.json)
    return "success"

@app.route("/user", methods = ["GET", "POST"])
def getUser():
    user = session.get("user")
    if not user:
        return Response("false", status = 401)
    if request.method == "GET":
        return prepareUserWithData(user)
    _updateUserData(user, request.json)
    return "success"

##

def _updateUserData(user: dict, data: dict):
    name = user["userinfo"]["email"]
    pw = user["userinfo"]["sub"]
    query = f"\"username\" = '{name}' AND \"password\" = '{pw}'"

    def toSetter(string: str) -> str:
        return string.replace("'", "''")

    return

    with conn.cursor() as curs:
        curs.execute('SELECT id FROM "UserDbs" WHERE ' + query)
        row = curs.fetchone()
        stringified = toSetter(json.dumps(data))
        if row:
            print("update existing")
            curs.execute('UPDATE "UserDbs" SET data = \'' + stringified + '\' WHERE ' + query)
        else:
            print("create new")
            query = f"('{name}', '{pw}', '{stringified}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
            curs.execute('INSERT INTO "UserDbs" (username, password, data, "createdAt", "updatedAt") VALUES ' + query)

    conn.commit()

def prepareUserWithData(user: dict):
    name = user["userinfo"]["email"]
    pw = user["userinfo"]["sub"]

    value = {
        "user": user
    }

    for entry in UserModel.query(pw,
                                 UserModel.username == name):
        value["playlists"] = entry.playlists
        value["tokens"] = entry.tokens.as_dict()

    return value

@app.route('/assets/<path:path>')
def asset(path: str):
    return send_from_directory('ui/dist/assets', path)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def wildcard(path: str):
    #return path
    return send_file('ui/dist/index.html')

app.wsgi_app = DispatcherMiddleware(run_simple, {'/default': app.wsgi_app})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=env.get("PORT", 3002))
