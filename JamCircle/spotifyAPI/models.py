from django.db import models

# Create your models here.


class SpotifyToken(models.Model):
    session_id = models.CharField(max_length=100, unique=True, default="foobar")
    user_id = models.CharField(max_length=100, unique=True, default="foobar")
    create_at = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=250)
    refresh_token = models.CharField(max_length=250)
    expires_at = models.DateTimeField()
    token_type = models.CharField(max_length=50)
