from django.db import models
import random
import string
# Create your models here.

def generate_unique_code():
    length = 5

    while True:
        agora_uid = "".join(random.choices(string.digits, k=length))
        if User.objects.filter(agora_uid=agora_uid).count() == 0:
            break
    return agora_uid

class User(models.Model):
    spotify_id = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100)
    token = models.OneToOneField(
        'spotifyAPI.SpotifyToken',
        on_delete=models.SET_NULL,
        related_name='user',
        null=True,
        blank=True
    )
    agora_uid = models.CharField(max_length=20, default=generate_unique_code, unique=True)
    email = models.EmailField(
        max_length=100, unique=True, null=True, blank=True)
    profile_pic_url = models.URLField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=50, blank=True, null=True)
    product_type = models.CharField(max_length=50, blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    playlists = models.JSONField(encoder=None, decoder=None)
    top_10_tracks = models.JSONField(encoder=None, decoder=None)
    top_10_artists = models.JSONField(encoder=None, decoder=None)
    friends = models.ManyToManyField("User", blank=True)
    pending_friend_requests = models.ManyToManyField("Friend_Request", blank=True)

    #Stats to Track
    unique_songs = models.IntegerField(default=0)
    unique_artists = models.IntegerField(default=0)
    high_popularity_tracks = models.IntegerField(default=0)
    low_popularity_tracks = models.IntegerField(default=0)


    def __str__(self):
        return self.display_name

class Friend_Request(models.Model):
    from_user = models.ForeignKey(
        "user.User",
        related_name='from_user',
        on_delete=models.CASCADE
        )
    to_user = models.ForeignKey(
        "user.User",
        related_name='to_user',
        on_delete=models.CASCADE
        )
    def __str__(self):
        return 
    
