from django.db import models

# Create your models here.


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
    email = models.EmailField(
        max_length=100, unique=True, null=True, blank=True)
    profile_pic_url = models.URLField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=50, blank=True, null=True)
    product_type = models.CharField(max_length=50, blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.display_name
