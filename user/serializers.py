from rest_framework import serializers
# from ..api.models import User
from .models import User
from spotifyAPI.util import get_total_listening_time


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'user_id', 'user_name', 'signup_date')


class UserLeaderboardSerializer(serializers.ModelSerializer):
    hoursListened = serializers.SerializerMethodField()
    uniqueSongs = serializers.IntegerField(source='unique_songs')
    uniqueArtists = serializers.IntegerField(source='unique_artists')

    class Meta:
        model = User
        fields = ['id', 'display_name', 'profile_pic_url',
                  'hoursListened', 'uniqueSongs', 'uniqueArtists']

    def get_hoursListened(self, obj):
        total_time_ms = get_total_listening_time(obj)
        hours_listened = total_time_ms / (1000 * 60 * 60)
        return round(hours_listened, 2)
