from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from spotifyAPI.util import user_token_func, is_authenticated, refresh_token, get_user_token, getOtherUserJSON, spotify_api_request

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