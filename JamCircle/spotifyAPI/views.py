from django.shortcuts import render, redirect
from .auth import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, SPOTIFY_URL
from rest_framework.views import APIView
from requests import Request, post
import requests
from rest_framework import status
from rest_framework.response import Response
from .util import user_token_func, is_authenticated, refresh_token, get_user_token
from .models import SpotifyToken
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
    expires_in = response.get('expires_in')
    error = response.get('error')

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
        if not request.session.exists(request.session.session_key):
            request.session.create()
        session_key = request.session.session_key
        print("Session key: ", session_key)
        token = SpotifyToken.objects.filter(user=session_key).first()
        print("Token: ", token)
        # TODO: Check if token has expired, if so need to use refresh token to generate new access token
        if token:
            now = datetime.now(pytz.utc)

            print("Time now: ", now)
            print("Expires at: ", token.expires_at)
            if now >= token.expires_at:  # Token has expired, need to generate a new access token
                new_access_token, new_expires_at = self.refresh_access_token(
                    token.refresh_token)
                token.access_token = new_access_token
                token.expires_at = new_expires_at
                token.save()
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

    def refresh_access_token(self, refresh_token):
        token_url = 'https://accounts.spotify.com/api/token'

        # Client credentials
        client_id = CLIENT_ID
        client_secret = CLIENT_SECRET

        client_creds = f"{client_id}:{client_secret}"
        client_creds_b64 = b64encode(client_creds.encode()).decode()

        headers = {
            'Authorization': f'Basic {client_creds_b64}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        data = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }

        response = requests.post(token_url, headers=headers, data=data)

        # Check if the request was successful
        if response.status_code == 200:
            response_data = response.json()
            new_access_token = response_data['access_token']

            expires_in = response_data['expires_in']
            now = datetime.now(pytz.utc)
            new_expires_at = now + timedelta(seconds=expires_in)

            return new_access_token, new_expires_at
        else:
            raise Exception("Failed to refresh Spotify token")
