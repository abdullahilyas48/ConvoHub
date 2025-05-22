from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Room
from authentication.decorators import return_class
from authentication.constants import SUCCESS_RESPONSE_CODE, BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE


class JoinRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            # Check if the room exists
            try:
                room = Room.objects.get(pk=pk)
            except Room.DoesNotExist:
                return return_class({
                    "data": {},
                    "message": "Room not found.",
                    "status": BAD_REQUEST_CODE
                })

            # Check if the user is already a member
            if request.user in room.members.all():
                return return_class({
                    "data": {},
                    "message": "You are already a member of this room.",
                    "status": BAD_REQUEST_CODE
                })

            # Add the user to the room's members
            room.members.add(request.user)
            return return_class({
                "data": {
                    "room_id": room.id,
                    "room_name": room.name
                },
                "message": f"You have successfully joined the room: {room.name}.",
                "status": SUCCESS_RESPONSE_CODE
            })

        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while joining the room.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })
