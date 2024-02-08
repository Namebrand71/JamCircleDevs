from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.


class Review(models.Model):
    spotify_content_id = models.CharField(max_length=22)
    author = models.ForeignKey('user.User', on_delete=models.CASCADE)
    posted_at = models.DateTimeField(auto_now_add=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, validators=[
                                 MinValueValidator(0.5), MaxValueValidator(5.0)])
    text = models.TextField(max_length=2048)

    def __str__(self):
        return f"Review by {self.author} for song {self.spotify_song_id}"
