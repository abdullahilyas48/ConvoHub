from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from .models import Room
from chat.models import Message
from chat.serializers import MessageSerializer
from .serializers import RoomSerializer, RoomCreateSerializer
from authentication.decorators import return_class
from authentication.constants import (
    SUCCESS_RESPONSE_CODE,
    BAD_REQUEST_CODE,
    UNAUTHORIZED,
    )

class RoomListView(generics.ListAPIView):
    """
    Lists rooms joined by the user, or rooms sorted by member count if the user has not joined any.
    """
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Returns rooms joined by the user or rooms sorted by member count if the user has not joined any.
        """
        user = self.request.user
        joined_rooms = Room.objects.filter(members=user).order_by('-created_at')

        if joined_rooms.exists():
            return joined_rooms
        
        return Room.objects.annotate(member_count=Count('members')).order_by('-member_count', '-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'data': serializer.data,
            'message': "Rooms fetched successfully",
            'status': SUCCESS_RESPONSE_CODE
        })



class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieves, updates, or deletes a single room's details.
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
            instance = self.get_object()
            room_serializer = self.get_serializer(instance)

            
            messages = Message.objects.filter(room=instance).order_by('-created_at')  
            message_serializer = MessageSerializer(messages, many=True)

            
            return Response({
                'data': {
                    'room': room_serializer.data,
                    'messages': message_serializer.data,
                },
                'message': "Room details and messages fetched successfully",
                'status': "success",
            })

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        # Check if the request.user is the host
        if instance.host != request.user:
            return return_class({
                'data': {},
                'message': "You are not authorized to update this room. Only the host can update it.",
                'status': UNAUTHORIZED 
            })
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return return_class({
                'data': serializer.data,
                'message': "Room updated successfully",
                'status': SUCCESS_RESPONSE_CODE
            })
        return return_class({
            'data': serializer.errors,
            'message': "Failed to update room",
            'status': BAD_REQUEST_CODE
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Check if the request.user is the host
        if instance.host != request.user:
            return return_class({
                'data': {},
                'message': "You are not authorized to delete this room. Only the host can delete it.",
                'status': UNAUTHORIZED 
            })
        instance.delete()
        return return_class({
            'data': {},
            'message': "Room deleted successfully",
            'status': SUCCESS_RESPONSE_CODE
        })


class RoomCreateView(APIView):
    """
    Creates a new room with the requesting user as the host.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = RoomCreateSerializer(data=request.data)
        if serializer.is_valid():
            room = serializer.save(host=request.user)
            return return_class({
                'data': RoomSerializer(room).data,
                'message': "Room created successfully",
                'status': SUCCESS_RESPONSE_CODE
            })
        return return_class({
            'data': serializer.errors,
            'message': "Failed to create room",
            'status': BAD_REQUEST_CODE
        })
