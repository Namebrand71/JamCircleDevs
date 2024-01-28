from django.urls import path
from .views import *
urlpatterns = [
    path('authSpotify', SpotifyLogin.as_view()),
    path('redirect', spotfy_callback),
    path('is-authenticated', Authenticated.as_view()),
    path('request-test', RequestTest.as_view())
]