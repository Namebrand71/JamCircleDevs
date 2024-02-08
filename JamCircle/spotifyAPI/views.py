from django.shortcuts import render, redirect
from .auth import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, SPOTIFY_URL
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.http import JsonResponse
from requests import Request, post
import requests
from rest_framework import status
from rest_framework.response import Response
from .util import user_token_func, is_authenticated, refresh_token, get_user_token, getUserJSON
from .models import SpotifyToken
from user.models import User
from django.utils import timezone
from datetime import timedelta, datetime
import pytz
from base64 import b64encode


class SpotifyLogin(APIView):
    def get(self, request, format=None):
        scopes = "user-read-private user-read-email user-top-read"

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

    if not request.session.exists(request.session.session_key):
        request.session.create()

    expires_at = timezone.now() + timedelta(hours=1)
    token = user_token_func(request.session.session_key, access_token,
                            token_type, expires_at, refresh_token)

    user_data = getUserJSON(request.session.session_key)

    user_defaults = {
        'display_name': user_data.get('display_name'),
        'email': user_data.get('email'),
        'profile_pic_url': user_data['images'][0]['url'] if user_data['images'] else None,
        'country': user_data.get('country'),
        'product_type': user_data.get('product'),
        'token': token,
    }

    user, created = User.objects.update_or_create(
        spotify_id=user_data['id'], defaults=user_defaults)

    return redirect('frontend:profile')


class Authenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class GetSpotifyProfile(APIView):
    def get(self, request, format=None):
        print("GetSpotifyProfile endpoint hit!")
        if not request.session.exists(request.session.session_key):
            request.session.create()
        session_key = request.session.session_key
        print("Session key: ", session_key)
        token = SpotifyToken.objects.filter(session_id=session_key).first()

        if is_authenticated(session_key):
            profile_response = getUserJSON(session_key)
            if profile_response:
                return Response(profile_response, status=200)
            print("Failed to fetch spotify profile")
            return Response({'error': 'Failed to fetch Spotify profile'}, status=400)
        else:
            return Response({'error': 'Authentication with Spotify failed or no token found'}, status=403)


@api_view(['GET'])
def search_spotify(request):
    query = request.GET.get('query')
    if query:
        access_token = get_user_token(request.session.session_key).access_token
        headers = {
            'Authorization': f'Bearer {access_token}',
        }
        params = {
            'q': query,
            'type': 'track',
            'limit': 10,
        }
        response = requests.get(
            'https://api.spotify.com/v1/search', headers=headers, params=params)
        return JsonResponse(response)
