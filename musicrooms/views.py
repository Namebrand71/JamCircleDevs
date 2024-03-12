from django.shortcuts import render
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
from user.views import getUserFromSession
import requests


def make_token(displayName, channelName, role):
    appId = AGORA_ID
    appCertificate = AGORA_CERT
    expirationTimeInSeconds = 3600
    currentTimeStamp = int(time.time())
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds

    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, displayName, role, privilegeExpiredTs)
    print("THIS IS THE TOE"+token)
    return token

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
    print(data['room_name'])
    host = getUserFromSession(request.session.session_key)
    room, created = Room.objects.get_or_create(
        host = host,
        room_name = data['room_name']
    )
    if created:
        host.agora_token = make_token(host.display_name, data['room_name'], 1)
        room.current_users.add(host)
        host.save()
        return JsonResponse({'name':data['room_name'], 'passcode':room.passcode}, safe=False)

    return Response({'Not Found': 'room couldnt be created'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
def join_room(request):
    data = json.loads(request.body)
    user = getUserFromSession(request.session.session_key)
    room = Room.objects.filter(room_name=data['room_name'], passcode=data['passcode']).first()
    if room is not None:
        user.agora_token = make_token(user.display_name, data['room_name'], 2)
        room.current_users.add(user)
        user.save()
        return Response({'Ok': 'Succsess'}, status=status.HTTP_200_OK)
    return Response({'Not Found': 'room not found'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
def leave_room(request):
    data = json.loads(request.body)
    user = getUserFromSession(request.session.session_key)
    room = Room.objects.filter(room_name=data['room_name']).first()
    if room is not None:
        room.current_users.delete(user)
        return Response({'Ok': 'Succsess'}, status=status.HTTP_200_OK)
    return Response({'Not Found': 'room not found'}, status=status.HTTP_404_NOT_FOUND)

def get_room_info(request):
    user = getUserFromSession(request.session.session_key)
    room = Room.objects.filter(current_users=user).first()
    room_list = {
        "AGORA_ID": AGORA_ID,
        "AGORA_CERT": AGORA_CERT,
        "current_user_uid": user.agora_uid,
        "current_user_name": user.display_name,
        "current_user_id": user.spotify_id,
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



