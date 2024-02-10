from django.urls import path
from .views import SpotifyLogin, spotfy_callback, Authenticated, GetSpotifyProfile
from .util import getTop10Tracks, getTop10Artist, is_authenticated_api, logout_api, getPlaylists
urlpatterns = [
    path('authSpotify', SpotifyLogin.as_view()),
    path('redirect', spotfy_callback),
    path('is-authenticated', Authenticated.as_view()),
    path('profile/', GetSpotifyProfile.as_view(), name='spotify-profile'),
    path('get-top-10-tracks/', getTop10Tracks, name='get_top_10_tracks'),
    path('get-top-10-artists/', getTop10Artist, name='get_top_10_artists'),
    path('is-authenticated/', is_authenticated_api, name='is_authenticated'),
    path('logout/', logout_api, name='logout_api'),
    path('get-playlists/', getPlaylists, name='get_playlists')
]
