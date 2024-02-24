from django.urls import path
from .views import ProfileView, all_listening_history

urlpatterns = [
    path('profile', ProfileView.as_view()),
    path('all-listening-history/', all_listening_history,
         name='all_listening_history')
]
