from .agora_key import RtcTokenBuilder
from django.shortcuts import render
from django.http import JsonResponse
import random
import time
from agora_key import RtcTokenBuilder
from .models import Room
from django.shortcuts import get_object_or_404
from user.models import User
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from user.views import getUserFromSession


def make_token(displayName, channelName, role):
    appId = "YOUR APP ID"
    appCertificate = "YOUR APP CERTIFICATE"
    expirationTimeInSeconds = 3600
    currentTimeStamp = int(time.time())
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds

    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, displayName, role, privilegeExpiredTs)

    return JsonResponse({'token': token}, safe=False)


def create_room(request):
    data = json.loads(request.body)
    host = getUserFromSession(request.session.session_key)
    room, created = Room.objects.get_or_create(
        host = host
    )
    if created:
        host.agora_token = make_token(host.display_name, data['room_name'], 1)
        room.current_users.add(host)
        return JsonResponse({'name':data['room'], 'passcode':room.passcode}, safe=False)

    return Response({'Not Found': 'room couldnt be created'}, status=status.HTTP_404_NOT_FOUND)

def join_room(request):
    data = json.loads(request.body)
    user = getUserFromSession(request.session.session_key)
    room = Room.objects.filter(room_name=data['room_name'], passcode=data['passcode']).first()
    if room is not None:
        user.agora_token = make_token(user.display_name, data['room_name'], 2)
        room.current_users.add(user)
        return Response({'Ok': 'Succsess'}, status=status.HTTP_200_OK)
    return Response({'Not Found': 'room not found'}, status=status.HTTP_404_NOT_FOUND)

def leave_room(request):
    data = json.loads(request.body)
    user = getUserFromSession(request.session.session_key)
    room = Room.objects.filter(room_name=data['room_name']).first()
    if room is not None:
        user.agora_token = ''
        room.current_users.delete(user)
        return Response({'Ok': 'Succsess'}, status=status.HTTP_200_OK)
    return Response({'Not Found': 'room not found'}, status=status.HTTP_404_NOT_FOUND)
