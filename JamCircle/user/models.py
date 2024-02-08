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
    friends = models.ManyToManyField("User", blank=True)
    pending_friend_requests = models.ManyToManyField("Friend_Request", blank=True)

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
    