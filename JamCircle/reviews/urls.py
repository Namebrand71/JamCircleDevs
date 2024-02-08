from django.urls import path
from .views import get_track_info, get_reviews, post_review

urlpatterns = [
    path('get_track_info/', get_track_info, name='get_track_info'),
    path('get_reviews/', get_reviews, name='get_reviews'),
    path('post_review/', post_review, name='post_review'),
]
