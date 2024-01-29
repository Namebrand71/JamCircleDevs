from django.urls import path
<<<<<<< HEAD
from .views import *
=======
from .views import SpotifyLogin, spotfy_callback, Authenticated, GetSpotifyProfile
>>>>>>> 22c1020cf1bee47a48abac1c31c19426ae068ca4
urlpatterns = [
    path('authSpotify', SpotifyLogin.as_view()),
    path('redirect', spotfy_callback),
    path('is-authenticated', Authenticated.as_view()),
<<<<<<< HEAD
    path('request-test', RequestTest.as_view())
]
=======
    path('profile/', GetSpotifyProfile.as_view(), name='spotify-profile'),
]
>>>>>>> 22c1020cf1bee47a48abac1c31c19426ae068ca4
