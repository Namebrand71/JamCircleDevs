from django.urls import path
from .views import index
from user.views import user_page, friends_page
from reviews.views import song_page, artist_page, album_page

app_name = 'frontend'
urlpatterns = [
    path('', index, name='home'),
    path('profile', index, name='profile'),
    path('song/<str:spotify_content_id>', song_page, name='song'),
    path('search/track/<str:search_query>', index, name='track_search'),
    path("user/<str:spotify_id>", user_page, name='user'),
    path('artist/<str:spotify_content_id>', artist_page, name='artist'),
    path('search/artist/<str:search_query>', index, name='artist_search'),
    path('artist/<str:spotify_content_id>', artist_page, name='artist'),
    path('album/<str:spotify_content_id>', album_page, name='artist'),
    path('friends/<str:spotify_id>/', friends_page, name='friends_page'),
    path('lobby', index, name='lobby'),
    path('musicroom', index, name='musicroom'),
]
