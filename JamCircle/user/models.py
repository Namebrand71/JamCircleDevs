from django.db import models

# Create your models here.

class User(models.Model):
    user_id = models.CharField(max_length=100, default="", unique=True)
    signup_date = models.DateTimeField(auto_now_add=True)
    user_profile = models.JSONField()
    top_10_tracks = models.JSONField()
    top_10_artists = models.JSONField()
