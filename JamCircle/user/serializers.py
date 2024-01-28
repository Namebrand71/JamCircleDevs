from rest_framework import serializers
from ..api.models import User


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'user_id', 'user_name', 'signup_date')
