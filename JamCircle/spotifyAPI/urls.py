from django.urls import path
from .views import AuthURL, spotfy_callback
urlpatterns = [
    path('authSpotify', AuthURL.as_view()),
    path('redirect', spotify_callback)
]