from django.urls import path
from .views import *
urlpatterns = [
    path('get_user_info/<str:spotify_id>/', get_user_info, name='get_user_info'),
    path('get-user-top-10-tracks/<str:spotify_id>/', getUserTop10Tracks, name='get_user_top_10_tracks'),
    path('get-user-top-10-artists/<str:spotify_id>/', getUserTop10Artist, name='get_user_top_10_artists'),
    path('get-user-playlists/<str:spotify_id>/', getUserPlaylists, name='get_user_playlists'),
    path('is-session-user/<str:spotify_id>/', isSessionUser, name='is_session_user'),
    path('get-users-friends/<str:spotify_id>/', getUsersFriends, name='get_users_friends'),
    path('get-users-pending-friends/<str:spotify_id>/', getUsersPendingFriends, name='get_users_pending_friends'),
    path('send-friend-request/<str:spotify_id>/', sendFriendRequest, name='send_friend_request'),
    path('accept-friend-request/<str:spotify_id>/', acceptFriendRequest, name='accept_friend_request'),
    path('reject-friend-request/<str:spotify_id>/', rejectFriendRequest, name='reject_friend_request'),
    path('cancel-friend-request/<str:spotify_id>/', cancelFriendRequest, name='cancel_friend_request'),
]
