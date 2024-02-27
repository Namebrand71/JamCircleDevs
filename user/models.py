from django.db import models

# Create your models here.

#Init function to fill in defaults for time-based stats
#Time bounds are 1month, 3months, 1yr
def init_stats():
    return {
        "past_month": 0,
        "past_3_months": 0,
        "past_year": 0
    }

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
    playlists = models.JSONField(encoder=None, decoder=None)
    top_10_tracks = models.JSONField(encoder=None, decoder=None)
    top_10_artists = models.JSONField(encoder=None, decoder=None)
    friends = models.ManyToManyField("User", blank=True)
    pending_friend_requests = models.ManyToManyField("Friend_Request", blank=True)

    #Stats to Track
    unique_artists = models.JSONField(default=init_stats)
    unique_genres = models.JSONField(default=init_stats)



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
    
