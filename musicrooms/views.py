
from django.http import JsonResponse
import random
import time
from .agora_key import RtcTokenBuilder, AGORA_ID, AGORA_CERT
from .models import Room
from django.shortcuts import get_object_or_404
from user.models import User
import json
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from user.views import get_user_from_session
from django.shortcuts import render, redirect
import requests

@api_view(['GET'])
def start_token_server(request):
    agora_token_server_url = "https://agora-token-server-qbmd.onrender.com/getToken"
    response = requests.post(agora_token_server_url)
    return JsonResponse(123, safe=False)


def get_agora_token(request, channel_name, uid):
    agora_token_server_url = "https://agora-token-server-qbmd.onrender.com/getToken"
    print("THIS IS THE CHANNEL NAME: ", channel_name)
    data = {
        "tokenType": "rtc",
        "channel": channel_name,
        "role": "publisher",
        "uid": uid,
        "expire": 3600
    }

    headers = {
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(agora_token_server_url, json=data, headers=headers)

        if response.ok:
            token_data = response.json()
            return JsonResponse(token_data)
        else:
            return JsonResponse({"error": "Failed to get Agora token"}, status=response.status_code)
    except requests.RequestException as e:
        return JsonResponse({"error": f"Request failed: {e}"}, status=500)

@api_view(['POST'])
def create_room(request):
    data = json.loads(request.body)
    host = get_user_from_session(request.session.session_key)
    room, created = Room.objects.get_or_create(
        host = host,
        room_name = data['room_name']
    )
    if created:
        room.current_users.add(host)
        room.save()
        return JsonResponse({'name':data['room_name'], 'passcode':room.passcode}, safe=False)

    return Response({'Not Found': 'room couldnt be created'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
def join_room(request):
    data = json.loads(request.body)
    user = get_user_from_session(request.session.session_key)
    room = Room.objects.get(room_name=data['room_name'], passcode=data['passcode'])
    if room is not None:
        room.current_users.add(user)
        user.save()
        room.save()
        return Response({'Ok': 'Succsess'}, status=status.HTTP_200_OK)
    return Response({'Not Foundh': 'room not foundh'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def leave_room(request):
    data = json.loads(request.body)
    user = get_user_from_session(request.session.session_key)
    room = Room.objects.filter(room_name=data['room_name']).last()

    if room is not None:
        # Remove the user from the current_users field
        room.current_users.remove(user)

        # Check if the current_users field is empty
        if not room.current_users.exists():
            # If it's empty, delete the room object
            room.delete()
        else:
            # If it's not empty, update the room's host to the next user in the list
            room.host = room.current_users.first()
            room.save()

        return redirect('frontend:profile')

    return Response({'Forbidden': 'Room not found'}, status=status.HTTP_403_FORBIDDEN)
@api_view(['POST'])
def get_room_info(request):
    data = json.loads(request.body)
    user = get_user_from_session(request.session.session_key)
    room = Room.objects.filter(current_users=user).last()
    room_list = {
        "AGORA_ID": AGORA_ID,
        "AGORA_CERT": AGORA_CERT,
        "current_user_uid": user.agora_uid,
        "current_user_name": user.display_name,
        "current_user_id": user.spotify_id,
        "current_user_spotify_token": user.token.access_token,
        "room_name": room.room_name,
        "passcode": room.passcode,
        "host_name": room.host.display_name,
        "host_id": room.host.spotify_id,
        "current_song": room.current_song_id,
        "current_user_id_list": list(room.current_users.values_list('display_name', flat=True)),
        "current_user_name_list": list(room.current_users.values_list('spotify_id', flat=True))
    }
    print(room_list)

    return JsonResponse(room_list, safe=False)



