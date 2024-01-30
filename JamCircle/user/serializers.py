from rest_framework import serializers
from ..user.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ( 'user_id', 'signup_date', 'user_profile', 'top_10_artists', 'top_10_tracks')
