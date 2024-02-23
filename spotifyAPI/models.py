from django.db import models

# Create your models here.


class SpotifyToken(models.Model):
    session_id = models.CharField(max_length=50, unique=True)
    create_at = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=300)
    refresh_token = models.CharField(max_length=300)
    expires_at = models.DateTimeField()
    token_type = models.CharField(max_length=50)


class ListeningData(models.Model):
    user = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, related_name='listening_data')
    track_name = models.CharField(max_length=255)
    track_spotify_id = models.CharField(max_length=255)
    artist_names = models.CharField(max_length=255)
    album_name = models.CharField(max_length=255)
    album_spotify_id = models.CharField(max_length=255)
    played_at = models.DateTimeField()
    track_popularity = models.IntegerField(null=True, blank=True)
    album_image_url = models.URLField(max_length=1024, null=True, blank=True)
    track_preview_url = models.URLField(max_length=1024, null=True, blank=True)
    external_urls = models.JSONField()
    duration_ms = models.IntegerField(null=True, blank=True)
    explicit = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'track_spotify_id', 'played_at')

    def __str__(self):
        return f"{self.user.display_name} - {self.track_name} on {self.played_at}"
