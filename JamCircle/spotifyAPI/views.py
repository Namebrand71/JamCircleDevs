from django.shortcuts import render, redirect
from .auth import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, SPOTIFY_URL
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *



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
    expires_in = response.get('expires_in')
    error = response.get('error')


    user_token_func(request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('PLACEHOLDER')


class Authenticated(APIView): 
    def get(self, request, format=None):
        is_authenticated = is_authenticated(self.request.session.session_key)
        return Response({'status':is_authenticated}, status=status.HTTP_200_OK)
    
class RequestTest(APIView):
    def get(self, request, format=None):
        return Response(getTop10Artist(request.session.session_key),status=status.HTTP_200_OK)
    

    
