from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import Request, post, put, get
from .auth import CLIENT_ID, CLIENT_SECRET, SPOTIFY_URL
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

def is_authenticated(session_id):
    token = get_user_token(session_id)
    if token:
        if token.expires_in < timezone.now():
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
    expires_in = response.get('expires_in')
    token_type = response.get('token_type')
    

    SpotifyToken.objects.update_or_create(
        user=session_id,
        defaults={
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': token_type,
            'expires_in': expires_in
        }
    )

def get_user_token(session_id):
    user_tokens = SpotifyToken.objects.filter(session_id=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def spotify_api_request(session_id, endpoint, ifPost=False,ifPut=False):
    token = get_user_token(session_id)
    header = {'Content-Type': 'application/json', 'Authorization': "Bearer " + token.access_token}

    if ifPost:
        post(SPOTIFY_URL + endpoint, headers=header)
    if ifPut:
        put(SPOTIFY_URL + endpoint, headers=header)
    responce = get(SPOTIFY_URL + endpoint, headers=header)
    #Might not get something back
    return responce.json

def getTop10Artist(session_id):
    responce = spotify_api_request(session_id,'/me/top/artists?time_range=long&limit=10&offset=0', False, False)
    art_list = responce.get('items')
    return art_list.json

def getTop10Tracks(session_id):
    responce = spotify_api_request(session_id,'/me/top/tracks?time_range=long&limit=10&offset=0', False, False)
    track_list = responce.get('items')
    return track_list.json

#Give a list of strings of Spotify IDs. Give session_id and list of Spotify IDs
def checkFollowing(session_id, list):
    for x in list:
        idString = idString + "%2C" + x
    #Removes first %2C
    idString = idString[3:]

    requestEndpoint = '/me/following/contains?type=user&ids=' + idString
        
    responce = spotify_api_request(session_id,requestEndpoint, False, False)
    return responce.json

def getUserJSON(session_id):
    responce = spotify_api_request(session_id, "/me", False, False)
    return responce.json
