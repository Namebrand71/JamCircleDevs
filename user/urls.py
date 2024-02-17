from django.urls import path
from .views import *
urlpatterns = [
    path('get_user_info/<str:spotify_id>/', get_user_info, name='get_user_info'),
    path('get-user-top-10-tracks/<str:spotify_id>/', getUserTop10Tracks, name='get_user_top_10_tracks'),
    path('get-user-top-10-artists/<str:spotify_id>/', getUserTop10Artist, name='get_user_top_10_artists'),
    path('get-user-playlists/<str:spotify_id>/', getUserPlaylists, name='get_user_playlists'),
]
