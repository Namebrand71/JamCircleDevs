from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics, status
from .serializers import ProfileSerializer
from .models import Profile
from spotifyAPI.models import ListeningData
from rest_framework.views import APIView
from rest_framework.response import Response
from collections import defaultdict
from django.shortcuts import get_object_or_404
from user.models import User

# Create your views here.


class ProfileView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


def all_listening_history(request, spotify_id):

    user = get_object_or_404(User, spotify_id=spotify_id)

    # Assuming 'user' is a ForeignKey in your ListeningData model
    # Include the user's own ID
    friend_ids = list(user.friends.values_list('id', flat=True)) + [user.id]
    print(friend_ids)

    # Filter history_items to include only friends
    history_items = ListeningData.objects.filter(user_id__in=friend_ids).order_by('-played_at').select_related('user')

    # Creating a list of dictionaries for each listening data entry
    listening_data_list = [
        {
            'user_display_name': item.user.display_name,
            'track_id': item.track_spotify_id,
            'track_name': item.track_name,
            'artist_names': item.artist_names,
            'album_name': item.album_name,
            'played_at': item.played_at.isoformat(),
            'album_image_url': item.album_image_url,
            'track_preview_url': item.track_preview_url,
            'external_urls': item.external_urls,
            'duration_ms': item.duration_ms,
            'explicit': item.explicit,
            'user_profile_image': item.user.profile_pic_url,
        }
        for item in history_items
    ]

    return JsonResponse(listening_data_list, safe=False)

    history = ListeningData.objects.all().order_by(
        'user', '-played_at').select_related('user')
    grouped_history = defaultdict(list)

    for entry in history:
        # Assuming User model has a display_name field
        user_display_name = entry.user.display_name
        grouped_history[user_display_name].append({
            'track_name': entry.track_name,
            'artist_names': entry.artist_names,
            'album_name': entry.album_name,
            'album_image_url': entry.album_image_url,
            'track_spotify_id': entry.track_spotify_id,
            'played_at': entry.played_at,
        })
        print(entry.user.display_name, ": ", entry.played_at)

    print("PRINTING GROUPED HISTORY")
    for item in grouped_history:
        print(item)
    print("PRINTING HISTORY")
    for item in history:
        print(item)

    return JsonResponse(list(history), safe=False)


def all_review_history(request, spotify_id):

    user = get_object_or_404(User, spotify_id=spotify_id)

    # Step 2: Get the friends for the given user
    friends = user.friends.all()  # Assuming 'friends' is the ManyToManyField

    # Step 3: Query ListeningData for friends and order by datetime in descending order
    history_items = ListeningData.objects.filter(user__in=friends).order_by('-datetime_field')

    # Creating a list of dictionaries for each listening data entry
    listening_data_list = [
        {
            'user_display_name': item.user.display_name,
            'track_id': item.track_spotify_id,
            'track_name': item.track_name,
            'artist_names': item.artist_names,
            'album_name': item.album_name,
            'played_at': item.played_at.isoformat(),
            'album_image_url': item.album_image_url,
            'track_preview_url': item.track_preview_url,
            'external_urls': item.external_urls,
            'duration_ms': item.duration_ms,
            'explicit': item.explicit,
            'user_profile_image': item.user.profile_pic_url,
        }
        for item in history_items
    ]

    return JsonResponse(listening_data_list, safe=False)