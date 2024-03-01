from django.urls import path
from .views import *

urlpatterns = [
    path('profile', ProfileView.as_view()),
    path('all-listening-history/<str:spotify_id>/', all_listening_history,
         name='all_listening_history'),
    path('all-review-history/<str:spotify_id>/', all_review_history,
         name='all_review_history')
]
