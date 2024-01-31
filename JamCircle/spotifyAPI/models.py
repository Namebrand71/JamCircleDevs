from django.db import models

# Create your models here.


class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    create_at = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=200)
    refresh_token = models.CharField(max_length=200)
    expires_at = models.DateTimeField()
    token_type = models.CharField(max_length=50)
