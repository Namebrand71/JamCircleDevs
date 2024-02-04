from django.urls import path
from .views import get_track_info, get_reviews

urlpatterns = [
    path('get_track_info/', get_track_info, name='get_track_info'),
    path('get_reviews/', get_reviews, name='get_reviews'),

]
