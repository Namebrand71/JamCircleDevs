from django.urls import path
from .views import *
urlpatterns = [
    path('get_user_info/<str:spotify_id>/',
         get_user_info, name='get_user_info'),
    path('get-user-top-10-tracks/<str:spotify_id>/',
         get_user_top_10_tracks, name='get_user_top_10_tracks'),
    path('get-user-top-10-artists/<str:spotify_id>/',
         get_user_top_10_artist, name='get_user_top_10_artists'),
    path('get-user-playlists/<str:spotify_id>/',
         get_user_playlists, name='get_user_playlists'),
    path('get-display-name/<str:spotify_id>/',
         get_display_name, name='get_display_name'),
    path('is-session-user/<str:spotify_id>/',
         is_session_user, name='is_session_user'),
    path('get-user-friends/<str:spotify_id>/',
         get_users_friends, name='get_users_friends'),
    path('get-user-pending-friends/', get_user_pending_friends,
         name='get_users_pending_friends'),
    path('send-friend-request/<str:spotify_id>/',
         send_freind_request, name='send_friend_request'),
    path('accept-friend-request/<str:spotify_id>/',
         accept_friend_request, name='accept_friend_request'),
    path('reject-friend-request/<str:spotify_id>/',
         reject_friend_request, name='reject_friend_request'),
    path('cancel-friend-request/<str:spotify_id>/',
         cancel_friend_request, name='cancel_friend_request'),
    path('get-user-stats/<str:spotify_id>/', get_user_stats, name='get_user_stats'),
    path('leaderboard/', LeaderboardList.as_view(), name='leaderboard')
]
