from django.urls import path
from .views import SpotifyLogin, spotfy_callback, Authenticated
urlpatterns = [
    path('authSpotify', SpotifyLogin.as_view()),
    path('redirect', spotfy_callback),
    path('is-authenticated', Authenticated.as_view())
]