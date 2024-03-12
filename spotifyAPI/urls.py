from django.urls import path
from .views import *
from .util import *
urlpatterns = [
    path('authSpotify', SpotifyLogin.as_view()),
    path('redirect', spotfy_callback),
    path('is-authenticated', Authenticated.as_view()),
    path('profile/', GetSpotifyProfile.as_view(), name='spotify-profile'),
    path('get-top-10-tracks/', get_top_10_tracks, name='get_top_10_tracks'),
    path('get-top-10-artists/', get_top_10_artist, name='get_top_10_artists'),
    path('is-authenticated/', is_authenticated_api, name='is_authenticated'),
    path('logout/', logout_api, name='logout_api'),
    path('get-playlists/', get_playlists, name='get_playlists'),
    path('search_spotify_tracks/<str:search_query>/',
         search_spotify_tracks, name='search_spotify_tracks'),
    path('search_spotify_albums/<str:search_query>/',
         search_spotify_albums, name='search_spotify_albums'),
    path('search_spotify_artists/<str:search_query>/',
         search_spotify_artists, name='search_spotify_artists'),
    path('fetch-spotify-activity/', fetch_spotify_activity,
         name='fetch_spotify_activity'),
    path('currently-playing/', get_currently_playing, name='currently_playing'),
]
