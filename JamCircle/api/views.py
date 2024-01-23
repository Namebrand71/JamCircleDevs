from django.shortcuts import render
from rest_framework import generics
from .serializers import ProfileSerializer
from .models import Profile

# Create your views here.


class ProfileView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
