from django.urls import path
from .views import AuthURL, spotfy_callback, Authenticated
urlpatterns = [
    path('authSpotify', AuthURL.as_view()),
    path('redirect', spotfy_callback),
    path('is-authenticated', Authenticated)
]