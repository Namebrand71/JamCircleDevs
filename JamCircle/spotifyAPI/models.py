from django.db import models

# Create your models here.

<<<<<<< HEAD
class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    create_at = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=100)
    refresh_token = models.CharField(max_length=100)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)
=======

class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    create_at = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=200)
    refresh_token = models.CharField(max_length=200)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)
>>>>>>> 22c1020cf1bee47a48abac1c31c19426ae068ca4
