from rest_framework import serializers
from .models import Message
from rooms.serializers import UserSerializer
class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  

    class Meta:
        model = Message
        fields = ['id', 'user', 'content', 'created_at']
