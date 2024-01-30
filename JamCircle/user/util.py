from .models import User
from spotifyAPI.util import *
from django.utils import timezone
from datetime import timedelta
from requests import Request, post, put, get
from spotifyAPI.auth import CLIENT_ID, CLIENT_SECRET, SPOTIFY_URL
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

def update_or_create_User(session_id):

    top_10_artists = getTop10Artist(session_id)
    top_10_tracks = getTop10Tracks(session_id)
    user_profile = getUserJSON(session_id)

    user_id = user_profile.get('id')
    
    User.objects.update_or_create(
        user=user_id,
        defaults={
            'top_10_artists': top_10_artists,
            'top_10_tracks': top_10_tracks,
            'user_profile': user_profile
        }
    )
#Through user ID
def getUserFromID(user_id):
    user = SpotifyToken.objects.filter(user_id=user_id)
    return user
#Through session_id
def getUserFromToken(session_id):
    r = get_user_token(session_id)
    user_id = r.get('user_id')
    return getUserFromID(user_id)