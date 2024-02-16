from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from spotifyAPI.util import spotify_api_request
from user.models import User

# Create your views here.


def user_page(request, spotify_id):
    # You can add any necessary logic here, e.g., fetching data from the database

    # Render the template that contains your React app
    return render(request, 'frontend/index.html', {'spotify_id': spotify_id})

@api_view(['POST'])
def get_user_info(request):
    print("get_user_info called with arg: ",
          request.data.get('spotify_id'))

    print("SESSIONID: ", request.session.session_key)

    endpoint = '/users/' + request.data.get('spotify_id')

    response = spotify_api_request(
        request.session.session_key, endpoint, False, False)
    print(response)

    return JsonResponse(response)