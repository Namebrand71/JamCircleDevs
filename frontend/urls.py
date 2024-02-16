from django.urls import path
from .views import index
from reviews.views import song_page, artist_page

app_name = 'frontend'
urlpatterns = [
    path('', index, name='home'),
    path('profile', index, name='profile'),
    path('song/<str:spotify_content_id>', song_page, name='song'),
    path('search/track/<str:search_query>', index, name='track_search'),
    path('artist/<str:spotify_content_id>', artist_page, name='artist')
]
