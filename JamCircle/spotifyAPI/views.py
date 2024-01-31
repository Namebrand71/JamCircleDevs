from django.shortcuts import render, redirect
from .auth import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, SPOTIFY_URL
from rest_framework.views import APIView
from requests import Request, post, get
from rest_framework import status
from rest_framework.response import Response
from .util import *
from .models import SpotifyToken
from user.util import *
from django.utils import timezone
from datetime import timedelta, datetime
import pytz
from base64 import b64encode


class SpotifyLogin(APIView):
    def get(self, request, format=None):
        scopes = "user-read-private user-read-email user-top-read user-follow-read"
        
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
        }).prepare().url

        return Response({'url':url}, status=status.HTTP_200_OK)

def spotfy_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    error = response.get('error')

    header = {'Content-Type': 'application/json', 'Authorization': "Bearer " + access_token}
    user_profile = get(SPOTIFY_URL + "/me", headers=header).json()
    user_id = user_profile.get('id')

    expires_at = timezone.now() + timedelta(hours=1)
    user_token_func(request.session.session_key, access_token,
                    token_type, expires_at, refresh_token)

    # Create/Update spotify token in db
    SpotifyToken.objects.update_or_create(
        session_id=request.session.session_key,
        user_id=user_id,
        defaults={
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': token_type,
            'expires_at': expires_at
        }
    )

    update_or_create_User(request.session.session_key)

    return redirect('PLACEHOLDER')


class Authenticated(APIView): 
    def get(self, request, format=None):
        is_authenticated = is_authenticated(self.request.session.session_key)
        return Response({'status':is_authenticated}, status=status.HTTP_200_OK)
    
class RequestTest(APIView):
    def get(self, request, format=None):
        return Response(getTop10Artist(request.session.session_key),status=status.HTTP_200_OK)
    
class GetSpotifyProfile(APIView):
    def get(self, request, format=None):
        print("GetSpotifyProfile endpoint hit!")
        if not request.session.exists(request.session.session_key):
            request.session.create()
        session_key = request.session.session_key
        print("Session key: ", session_key)
        token = SpotifyToken.objects.filter(user=session_key).first()

        if is_authenticated(session_key):
            profile_response = getUserFromToken(session_key)
            if profile_response:
                return Response(profile_response, status=200)
            print("Failed to fetch spotify profile")
            return Response({'error': 'Failed to fetch Spotify profile'}, status=400)
        else:
            return Response({'error': 'Authentication with Spotify failed or no token found'}, status=403)
