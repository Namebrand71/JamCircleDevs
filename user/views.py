from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from spotifyAPI.util import *

# Create your views here.


def user_page(request, spotify_id):
    # You can add any necessary logic here, e.g., fetching data from the database

    # Render the template that contains your React app
    return render(request, 'frontend/index.html', {'spotify_id': spotify_id})


@api_view(['GET'])
def get_user_info(request, spotify_id):
    print("Request: ", request)
    print("SESSIONID: ", request.session.session_key)

    endpoint = '/users/' + spotify_id
    print("End: ", endpoint)

    response = spotify_api_request(
        request.session.session_key, endpoint, False, False)

    return JsonResponse(response)

def getUserTop10Artist(request, spotify_id):
    user = User.objects.filter(spotify_id=spotify_id).first()
    return JsonResponse(user.top_10_artists, safe=False)

def getUserTop10Tracks(request, spotify_id):
    user = User.objects.filter(spotify_id=spotify_id).first()
    return JsonResponse(user.top_10_tracks, safe=False)
    
def getUserPlaylists(request, spotify_id):
    user = User.objects.filter(spotify_id=spotify_id).first()
    return JsonResponse(user.playlists, safe=False)

def isSessionUser(request, spotify_id):
    current_user = getUserFromSession(request.session.session_key)
    if current_user.spotify_id == spotify_id:
        print('found!')
        return JsonResponse(True, safe=False)
    else:
        print('Not Found!')
        return JsonResponse(False, safe=False)
    
def getUserFromSession(session_id):
    token = get_user_token(session_id)
    current_user = User.objects.filter(token=token).first()
    return current_user