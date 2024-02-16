from django.urls import path
from .views import get_track_info, get_reviews, post_review, get_artist_info

urlpatterns = [
    path('get_track_info/', get_track_info, name='get_track_info'),
    path('get_reviews/', get_reviews, name='get_reviews'),
    path('post_review/', post_review, name='post_review'),
    path('get_artist_info/', get_artist_info, name='get_artist_info')
]
