from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import Request, post, put, get
from .auth import CLIENT_ID, CLIENT_SECRET, SPOTIFY_URL
from django.http import JsonResponse


def is_authenticated(session_id):
    token = get_user_token(session_id)
    print(token)
    print("is_authenticated called")
    print("Time now: ", timezone.now())
    if token:
        print("Expires at: ", token.expires_at)
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
    user_token_func(session_id, access_token, token_type, None, refresh_token)


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
    if response.status_code == 401:
        refresh_token(session_id)
        token = get_user_token(session_id)
        response = get(SPOTIFY_URL + endpoint)
        print("RESPONSE:       ", response)
    return response.json()


def getTop10Artist(request):
    session_id = request.session.session_key
    #  response = spotify_api_request(session_id, '/me/top/tracks?time_range=long&limit=10&offset=0', False, False)
    response = spotify_api_request(
        session_id, "/me/top/artists?limit=10&offset=0", False, False)
    print(response)
    artist_list = response.get('items')
    return JsonResponse(artist_list, safe=False)


def getTop10Tracks(request):
    session_id = request.session.session_key
    #  response = spotify_api_request(session_id, '/me/top/tracks?time_range=long&limit=10&offset=0', False, False)
    response = spotify_api_request(
        session_id, "/me/top/tracks?limit=10&offset=0", False, False)
    print(response)
    track_list = response.get('items')
    return JsonResponse(track_list, safe=False)

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
    print(response)
    return response
