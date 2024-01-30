from django.db import models

# Create your models here.


class SpotifyToken(models.Model):
    session_id = models.CharField(max_length=100, unique=True)
    user_id = models.CharField(max_length=100, unique=True)
    create_at = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=200)
    refresh_token = models.CharField(max_length=200)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)
