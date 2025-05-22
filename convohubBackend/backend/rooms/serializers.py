from rest_framework import serializers
from .models import Room
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_image']

    def get_profile_image(self, obj):
        
        user_profile = obj.profile  
        return user_profile.profile_image.url if user_profile and user_profile.profile_image else None


class RoomSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)  
    members = UserSerializer(many=True, read_only=True) 
    class Meta:
        model = Room
        fields = ['id', 'name','topic','description', 'host', 'members', 'created_at']

class RoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['name', 'topic', 'description']
        extra_kwargs = {
            'topic': {'required': True},  
            'description': {'required': False},  
        }

