from django.db import models

# Create your models here.


class SpotifyToken(models.Model):
    session_id = models.CharField(max_length=100, unique=True, default="foobar")
    user_id = models.CharField(max_length=100, unique=True, default="foobar")
    create_at = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=200, default="foobar")
    refresh_token = models.CharField(max_length=20, default="foobar")
    expires_at = models.DateTimeField(auto_now_add=True)
    token_type = models.CharField(max_length=50, default="foobar")
