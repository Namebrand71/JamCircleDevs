from django.urls import path
from .views import get_track_info

urlpatterns = [
    path('get_track_info/', get_track_info, name='get_track_info'),
]
