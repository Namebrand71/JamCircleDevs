from django.db import models
import random
import string
from user.models import User

# Create your models here.

def generate_unique_code():
    length = 6

    while True:
        code = "".join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break
    return code

class Room(models.Model):
    room_name = models.CharField(max_length=100, default='', unique=True)
    passcode = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='host')
    created_at = models.DateTimeField(auto_now_add=True)
    current_song_id = models.CharField(max_length=100, null=True)
    current_users = models.ManyToManyField("User", blank=True)
