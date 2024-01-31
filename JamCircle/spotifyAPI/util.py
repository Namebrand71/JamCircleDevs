from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import Request, post, put, get
from .auth import CLIENT_ID, CLIENT_SECRET, SPOTIFY_URL


def is_authenticated(session_id):
    token = get_user_token(session_id)
    print("is_authenticated called")
    print("Expires at: ", token.expires_at)
    print("Time now: ", timezone.now())
    if token:
        if token.expires_at < timezone.now():
            print("token has expired, getting a new token now")
            refresh_token(session_id)
        return True
    return False


def refresh_token(session_id):
    refresh_token = get_user_token(session_id).refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')

    refresh_token = response.get('refresh_token')
    token_type = response.get('token_type')
    user_token_func(session_id, access_token, token_type, refresh_token)


def get_user_token(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def user_token_func(session_id, access_token, token_type, expires_at, refresh_token):
    tokens = get_user_token(session_id)
    if not expires_at:
        expires_at = timezone.now() + timedelta(seconds=3600)

    if tokens:
        tokens.access_token = access_token
        tokens.expires_at = expires_at
        tokens.token_type = token_type  # Unsure if this needs to be updated
        tokens.save(update_fields=['access_token', 'expires_at'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token,
                              refresh_token=refresh_token, expires_at=expires_at, token_type=token_type)
        tokens.save()


def spotify_api_request(session_id, endpoint, ifPost=False, ifPut=False):
    token = get_user_token(session_id)
    header = {'Content-Type': 'application/json',
              'Authorization': "Bearer " + token.access_token}

    if ifPost:
        post(SPOTIFY_URL + endpoint, headers=header)
    if ifPut:
        put(SPOTIFY_URL + endpoint, headers=header)
    response = get(SPOTIFY_URL + endpoint, headers=header)
    # Might not get something back
    return response.json()


def getTop10Artist(session_id):
    response = spotify_api_request(
        session_id, '/me/top/artists?time_range=long&limit=10&offset=0', False, False)
    art_list = response.get('items')
    return art_list.json


def getTop10Tracks(session_id):
    response = spotify_api_request(
        session_id, '/me/top/tracks?time_range=long&limit=10&offset=0', False, False)
    track_list = response.get('items')
    return track_list.json

# Give a list of strings of Spotify IDs. Give session_id and list of Spotify IDs


def checkFollowing(session_id, list):
    for x in list:
        idString = idString + "%2C" + x
    # Removes first %2C
    idString = idString[3:]

    requestEndpoint = '/me/following/contains?type=user&ids=' + idString

    response = spotify_api_request(session_id, requestEndpoint, False, False)
    return response.json


def getUserJSON(session_id):
    response = spotify_api_request(session_id, "/me", False, False)
    return response
