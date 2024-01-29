from django.shortcuts import render, redirect
from .auth import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, SPOTIFY_URL
from rest_framework.views import APIView
from requests import Request, post
import requests
from rest_framework import status
from rest_framework.response import Response
<<<<<<< HEAD
from .util import *



class SpotifyLogin(APIView):
    def get(self, request, format=None):
        scopes = "user-read-private user-read-email user-top-read user-follow-read"
        
=======
from .util import user_token_func, is_authenticated
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta


class SpotifyLogin(APIView):
    def get(self, request, format=None):
        scopes = "user-read-private user-read-email user-top-read"

>>>>>>> 22c1020cf1bee47a48abac1c31c19426ae068ca4
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)

def spotfy_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

<<<<<<< HEAD
=======
def spotfy_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

>>>>>>> 22c1020cf1bee47a48abac1c31c19426ae068ca4
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
    expires_in = response.get('expires_in')
    error = response.get('error')

<<<<<<< HEAD

    user_token_func(request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('PLACEHOLDER')


class Authenticated(APIView): 
    def get(self, request, format=None):
        is_authenticated = is_authenticated(self.request.session.session_key)
        return Response({'status':is_authenticated}, status=status.HTTP_200_OK)
    
class RequestTest(APIView):
    def get(self, request, format=None):
        return Response(getTop10Artist(request.session.session_key),status=status.HTTP_200_OK)
    

    
=======
    if not request.session.exists(request.session.session_key):
        request.session.create()

    user_token_func(request.session.session_key, access_token,
                    token_type, expires_in, refresh_token)

    expires_in = timezone.now() + timedelta(seconds=response.get('expires_in'))

    # Create/Update spotify token in db
    SpotifyToken.objects.update_or_create(
        user=request.session.session_key,
        defaults={
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': token_type,
            'expires_in': expires_in
        }
    )

    return redirect('frontend:profile')


class Authenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class GetSpotifyProfile(APIView):
    def get(self, request, format=None):
        print("GetSpotifyProfile endpoint hit!")
        session_key = request.session.session_key
        print("Session key: ", session_key)
        token = SpotifyToken.objects.filter(user=session_key).first()
        if token:
            headers = {
                'Authorization': f'Bearer {token.access_token}'
            }
            profile_response = requests.get(
                'https://api.spotify.com/v1/me', headers=headers)
            if profile_response.status_code == 200:
                return Response(profile_response.json(), status=profile_response.status_code)
            print("Failed to fetch spotify profile")
            return Response({'error': 'Failed to fetch Spotify profile'}, status=profile_response.status_code)
        return Response({'error': 'No Spotify token found'}, status=400)
>>>>>>> 22c1020cf1bee47a48abac1c31c19426ae068ca4
