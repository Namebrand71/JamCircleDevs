from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from spotifyAPI.util import *
from .models import User, Friend_Request
from django.http import HttpResponse

# Create your views here.


def user_page(request, spotify_id):
    # You can add any necessary logic here, e.g., fetching data from the database

    # Render the template that contains your React app
    return render(request, 'frontend/index.html', {'spotify_id': spotify_id})


def friends_page(request, spotify_id):
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

def getUsersFriends(request, spotify_id):
    user = get_object_or_404(User, spotify_id=spotify_id)
    print(User)
    friends_list = list(user.friends.all().values())
    print(friends_list)
    return JsonResponse(friends_list, safe = False)

def getUsersPendingFriends(request, spotify_id):
    user = get_object_or_404(User, spotify_id=spotify_id)
    pending_friends_list = list(user.pending_friend_requests.all().values())
    return JsonResponse(pending_friends_list, safe = False)

def sendFriendRequest(request, spotify_id):
    from_user = getUserFromSession(request.session.session_key)
    to_user = User.objects.filter(spotify_id=spotify_id).first()
    friend_request, exist = Friend_Request.objects.get_or_create(from_user=from_user, to_user=to_user)


    if exist:
        return HttpResponse('Friend Request Already Sent')
    else:
        to_user.pending_friend_requests.add(friend_request)
        from_user.pending_friend_requests.add(friend_request)
        return HttpResponse('Friend Request Made!')

def acceptFriendRequest(request, spotify_id):
    to_user = getUserFromSession(request.session.session_key)
    from_user = User.objects.filter(spotify_id=spotify_id).first()
    friend_request, exists = to_user.pending_friend_requests.get(from_user=from_user)
    if exists:
        to_user.friends.add(from_user)
        from_user.friends.add(to_user)
        to_user.pending_friend_requests.delete(from_user=from_user)
        from_user.pending_friend_requests.delete(to_user=to_user)
        HttpResponse('Friend Request Accepted!')
    else:
        HttpResponse('error accepting friend request')

def rejectFriendRequest(request, spotify_id):
    to_user = getUserFromSession(request.session.session_key)
    from_user = User.objects.filter(spotify_id=spotify_id).first()
    friend_request, exists = to_user.pending_friend_requests.get(from_user=from_user)
    if exists:
        to_user.pending_friend_requests.delete(from_user=from_user)
        from_user.pending_friend_requests.delete(to_user=to_user)
        HttpResponse('Friend Request Rejected!')
    else:
        HttpResponse('error rejectinging friend request')

def cancelFriendRequest(request, spotify_id):
    to_user = User.objects.filter(spotify_id=spotify_id).first()
    from_user = getUserFromSession(request.session.session_key)
    friend_request, exists = from_user.pending_friend_requests.get(to_user=to_user)
    if exists:
        to_user.pending_friend_requests.delete(from_user=from_user)
        from_user.pending_friend_requests.delete(to_user=to_user)
        HttpResponse('Friend Request Canceled!')
    else:
        HttpResponse('error canceling friend request')