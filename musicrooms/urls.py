from django.urls import path
from .views import *

urlpatterns = [
    path('create-room', create_room, name='create_room'),
    path('join-room', join_room, name='join_room'),
    path('leave-room', leave_room, name='leave_room'),
    path('start-token-server', start_token_server, name='start_token_server'),
    path('get-room-info', get_room_info, name='get_room_info'),
    path('get-agora-token/<str:channel_name>/<str:uid>', get_agora_token, name='get_agora_token')
]
