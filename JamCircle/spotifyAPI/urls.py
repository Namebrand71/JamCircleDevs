from django.urls import path
from .views import SpotifyLogin, spotfy_callback, Authenticated, GetSpotifyProfile
from .util import getTop10Tracks
urlpatterns = [
    path('authSpotify', SpotifyLogin.as_view()),
    path('redirect', spotfy_callback),
    path('is-authenticated', Authenticated.as_view()),
    path('profile/', GetSpotifyProfile.as_view(), name='spotify-profile'),
    path('get-top-10-tracks/', getTop10Tracks, name='get_top_10_tracks'),
]
