from django.urls import path
from .views import AuthURL
urlpatterns = [
    path('authSpotify', AuthURL.as_view())
]