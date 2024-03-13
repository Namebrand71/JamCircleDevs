from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from spotifyAPI.util import *
from .models import User, Friend_Request
from spotifyAPI.models import ListeningData
from django.db.models import Sum
from django.http import HttpResponse
from .serializers import UserLeaderboardSerializer

# Create your views here.


def user_page(request, spotify_id):
    '''
    Makes a call to render UserPage react component

    @param request: Http Request
    @param spotify_id: Spotify ID of the User's page we want to render
    @return: render request of frontend component
    '''
    return render(request, 'frontend/index.html', {'spotify_id': spotify_id})


def friends_page(request, spotify_id):
    '''
    Makes a call to render FriendsPage react component

    @param request: Http Request
    @param spotify_id: Spotify ID of the User's page we want to render
    @return: render request of frontend component
    '''
    return render(request, 'frontend/index.html', {'spotify_id': spotify_id})


@api_view(['GET'])
def get_user_info(request, spotify_id):
    '''
    Makes API call to spotify to retrieve user info

    @param request: http request, contains session_key
    @param spotify_id: spotify ID of user to retrieve info of
    @return: SpotifyAPI JSON response 
    '''
    endpoint = '/users/' + spotify_id
    response = spotify_api_request(
        request.session.session_key, endpoint, False, False)
    return JsonResponse(response)

def get_user_top_10_artist(request, spotify_id):
    """
    Retrieves the top 10 artists of a user stored in our user table

    @param request: Http request
    @param spotify_id: Spotify username of desired user
    @return: top10 artists from a user in our database
    """
    user = User.objects.filter(spotify_id=spotify_id).first()
    return JsonResponse(user.top_10_artists, safe=False)


def get_user_top_10_tracks(request, spotify_id):
    """
    Retrieves the top 10 tracks of a user stored in our user table

    @param request: Http request
    @param spotify_id: Spotify username of desired user
    @return: top10 tracks from a user in our databse
    """
    user = User.objects.filter(spotify_id=spotify_id).first()
    return JsonResponse(user.top_10_tracks, safe=False)

def get_user_playlists(request, spotify_id):
    """
    Retrieves the spotify playlists a user has created that is stored in our user table

    @param request: Http request
    @param spotify_id: Spotify username of desired user
    @return: User's playlists stored in our database
    """
    user = User.objects.filter(spotify_id=spotify_id).first()
    return JsonResponse(user.playlists, safe=False)


def is_session_user(request, spotify_id):
    """
    Validates if the user has a valid session

    @param request: http request
    @param spotify_id: Spotify ID of the user making the request
    @return: True/False JSON response if current user is valid session user
    """
    current_user = get_user_from_session(request.session.session_key)
    if current_user.spotify_id == spotify_id:
        return JsonResponse(True, safe=False)
    else:
        return JsonResponse(False, safe=False)


def get_user_from_session(session_id):
    '''
    Retrieves the user key in our database associated with the holder of the current session_id

    @param session_id: session identifier granted on login
    @return: Current user of the session
    '''
    token = get_user_token(session_id)
    current_user = User.objects.filter(token=token).first()
    return current_user


def get_display_name(request, spotify_id):
    '''
    Retreives the display name of a specified user

    @param request: http request
    @param spotify_id: desired users spotify ID
    @return: Display name of user with spotify_id
    '''
    user = get_object_or_404(User, spotify_id=spotify_id)
    return JsonResponse(user.display_name, safe=False)


def get_users_friends(request, spotify_id):
    '''
    Retrieves the friends list of a specified user

    @param request: HTTP request
    @param spotify_id: The spotify id of desired user
    @return: JSON formatted list of a user's friends
    '''
    user = get_object_or_404(User, spotify_id=spotify_id)
    friends_list = list(user.friends.all().values(
        'spotify_id', 'display_name', 'profile_pic_url'))
    return JsonResponse(friends_list, safe=False)


def get_user_pending_friends(request):
    '''
    Retrieves list of pending freind requests for the user of current session

    @param request: Http request, contains session key
    @return: JSON formatted list of pending friends (sent, and recieved requests)
    '''
    user = get_user_from_session(request.session.session_key)
    pending_friends_list = list(user.pending_friend_requests.all().values(
        'from_user__spotify_id', 'to_user__spotify_id', 'from_user__display_name'))
    return JsonResponse(pending_friends_list, safe=False)


def send_freind_request(request, spotify_id):
    '''
    Sends a freind request from the session host to a specified user

    @param request: HTTP request, contains session_key
    @param spotify_id: The spotify id of a user you would like to send a friend request to
    @return: HTTP response if the request was made or already sent
    '''
    from_user = get_user_from_session(request.session.session_key)
    to_user = User.objects.filter(spotify_id=spotify_id).first()
    friend_request, exist = Friend_Request.objects.get_or_create(
        from_user=from_user, to_user=to_user)

    if exist:
        to_user.pending_friend_requests.add(friend_request)
        return HttpResponse('Friend Request Made!')
    else:
        return HttpResponse('Friend Request Already Sent')


def accept_friend_request(request, spotify_id):
    '''
    Accepts an incomming friend request issued by a user to session host
    Checks for valid incomming request then removes it from pending and adds
    friend on both users ends

    @param request: contains session_key (acceptee)
    @param spotify_id: id of friend request sender
    @return: Success message
    '''
    to_user = get_user_from_session(request.session.session_key)
    from_user = User.objects.filter(spotify_id=spotify_id).first()
    friend_request = get_object_or_404(Friend_Request, from_user=from_user, to_user=to_user)
    to_user.friends.add(from_user)
    from_user.friends.add(to_user)
    to_user.pending_friend_requests.remove(friend_request)
    from_user.pending_friend_requests.remove(friend_request)
    return HttpResponse('Friend Request Accepted!')


def reject_friend_request(request, spotify_id):
    '''
    Rejects an incomming freind request from a user

    @param request: http request, contains session_key
    @param spotify_id: freind request sender's spotify ID
    @return: HTTP response if the rejection was successful
    '''
    to_user = get_user_from_session(request.session.session_key)
    from_user = User.objects.filter(spotify_id=spotify_id).first()
    friend_request, exists = to_user.pending_friend_requests.get(from_user=from_user)
    if exists:
        to_user.pending_friend_requests.remove(from_user=from_user)
        from_user.pending_friend_requests.remove(to_user=to_user)
        HttpResponse('Friend Request Rejected!')
    else:
        HttpResponse('error rejectinging friend request')


def cancel_friend_request(request, spotify_id):
    '''
    Cancels an outgoing freind request that you have sent to another user

    @param request: http request, contains session_key
    @param spotify_id: freind request recipient's spotify ID
    @return: HTTP response if cancelation was successful
    '''
    to_user = User.objects.filter(spotify_id=spotify_id).first()
    from_user = get_user_from_session(request.session.session_key)

    # Assuming there is a related_name specified in the Friend_Request model for the pending_friend_requests field
    friend_request = from_user.pending_friend_requests.filter(
        to_user=to_user).first()

    if friend_request:
        to_user.pending_friend_requests.remove(friend_request)
        from_user.pending_friend_requests.remove(friend_request)
        return HttpResponse('Friend Request Canceled!')
    else:
        return HttpResponse('Error canceling friend request')


def get_total_listening_time(user):
    '''
    Retrieves total listening time in ms of a user
    
    @param user: the id of user in the database
    @return: User's total listening time in ms
    '''
    total_time = ListeningData.objects.filter(user=user).aggregate(
        total_time_listened=Sum('duration_ms'))['total_time_listened']
    if total_time is None:
        total_time = 0
    return total_time


def get_user_stats(request, spotify_id):
    '''
    Retrieves a JSON formmatted list of user's stats from the current session host

    @param request: HTTP Request, contains session_key
    @param spotify_id: spotify id of user whos stats to get
    @return: JSON formatted list of user stats defined in user.models
    '''
    try:

        user_obj = User.objects.get(spotify_id=spotify_id)
        update_stats(user_obj)
        stats = {
            'unique_songs': user_obj.unique_songs,
            'unique_artists': user_obj.unique_artists,
            'high_popularity_tracks': user_obj.high_popularity_tracks,
            'low_popularity_tracks': user_obj.low_popularity_tracks
        }
        return JsonResponse(stats, safe=False)
    except User.DoesNotExist:
        return None


def update_stats(user):
    '''
    Update the stats of a specified user (called from `get_user_stats()`)
    
    @param user: the id of user in database
    @return: none
    '''

    # Determine the cutoff between high/low popularity songs
    POPULARITY_THRESHOLD = 50

    '''
    unique_tracks:  Number of unique songs in a user's listening history
    unique_artists: Number of unique artists in listening history
    high_pop:       Number of "high popularity" songs in history (determined by POPULARITY_THRESHOLD value)
    low_pop:        Number of "low popularity" songs in history
    '''
    unique_tracks = ListeningData.objects.filter(
        user=user).values("track_spotify_id").distinct().count()
    unique_artists = ListeningData.objects.filter(
        user=user).values('artist_names').distinct().count()
    high_pop = ListeningData.objects.filter(
        user=user, track_popularity__gt=POPULARITY_THRESHOLD).count()
    low_pop = ListeningData.objects.filter(
        user=user, track_popularity__lt=POPULARITY_THRESHOLD).count()

    # Access and save computed values to User model
    user_obj = User.objects.get(pk=user.pk)
    user_obj.unique_artists = unique_artists
    user_obj.unique_songs = unique_tracks
    user_obj.high_popularity_tracks = high_pop
    user_obj.low_popularity_tracks = low_pop
    user_obj.save()


class LeaderboardList(APIView):
    def get(self, request, format=None):
        '''
        Updates and retrieves Leaderboard content for frontend

        @param self: Leaderboard class
        @param request: HTTP request
        @return: Serialized leaderboard data
        '''
        users = User.objects.all()
        users_listened_time = [
            (user, get_total_listening_time(user)) for user in users]
        # Sort users by listening time in descending order
        sorted_users = sorted(users_listened_time,
                              key=lambda x: x[1], reverse=True)
        
        for user, _ in sorted_users:
            update_stats(user)

        serializer = UserLeaderboardSerializer(
            [user[0] for user in sorted_users], many=True)
        return Response(serializer.data)
