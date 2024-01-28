from django.urls import path
from .views import index

app_name = 'frontend'
urlpatterns = [
    path('', index),
    path('profile', index, name='profile')
]
