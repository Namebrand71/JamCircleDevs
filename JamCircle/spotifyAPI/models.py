from django.db import models

# Create your models here.


class SpotifyToken(models.Model):
    session_id = models.CharField(max_length=50, unique=True)
    create_at = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=300)
    refresh_token = models.CharField(max_length=300)
    expires_at = models.DateTimeField()
    token_type = models.CharField(max_length=50)
