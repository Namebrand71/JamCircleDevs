from django.urls import path
from .views import SpotifyLogin, spotfy_callback, Authenticated, GetSpotifyProfile
urlpatterns = [
    path('authSpotify', SpotifyLogin.as_view()),
    path('redirect', spotfy_callback),
    path('is-authenticated', Authenticated.as_view()),
    path('profile/', GetSpotifyProfile.as_view(), name='spotify-profile'),
]
