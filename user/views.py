from django.shortcuts import render
from rest_framework import generics, status
from ..user.serializers import ProfileSerializer
from .models import Profile
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.


class ProfileView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer