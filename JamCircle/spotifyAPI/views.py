from django.shortcuts import render
from .auth import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
#SCOPES VIEWS
#1 = User
#2 = Profile

class AuthURL(APIView):
    def get(self, request, scope, format=None):
        match scope:
            case 1:
                scopes = "user-read-private user-read-email"
            case _:
                exit(1)
        
        url = Request('GET', 'https://accounts.spotify.com/authorize', parama={
            'scope': scopes,
            'responce_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
        }).prepare().url

        return Response({'url':url}, status=status.HTTP_200_OK)


