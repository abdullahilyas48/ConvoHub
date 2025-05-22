from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Room
from django.db.models import Q
from authentication.decorators import return_class
from authentication.constants import SUCCESS_RESPONSE_CODE, BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE


class SearchRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            query = request.query_params.get('query', '').strip()
            if not query:
                return return_class({
                    "data": {},
                    "message": "Query parameter is required.",
                    "status": BAD_REQUEST_CODE
                })

            
            rooms = Room.objects.filter(
                Q(name__icontains=query) | Q(topic__icontains=query)
            )

            if not rooms.exists():
                return return_class({
                    "data": {},
                    "message": "No rooms found matching the query.",
                    "status": SUCCESS_RESPONSE_CODE
                })

            # Prepare the response data
            data = [
                {
                    "room_id": room.id,
                    "room_name": room.name,
                    "topic": room.topic,
                    "description": room.description,
                    "host": room.host.username,
                    "members_count": room.members.count(),
                    "created_at": room.created_at
                }
                for room in rooms
            ]

            return return_class({
                "data": data,
                "message": f"{len(data)} room(s) found.",
                "status": SUCCESS_RESPONSE_CODE
            })

        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while searching for rooms.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })
