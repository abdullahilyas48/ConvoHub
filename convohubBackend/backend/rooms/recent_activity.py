from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from chat.models import Message
from authentication.decorators import return_class
from authentication.constants import SUCCESS_RESPONSE_CODE, BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE


class RecentActivitiesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Limit for recent activities (default: 50)
            limit = int(request.query_params.get('limit', 50))
            if limit <= 0:
                return return_class({
                    "data": {},
                    "message": "Limit parameter must be greater than 0.",
                    "status": BAD_REQUEST_CODE
                })

            # Fetch recent messages ordered by created_at
            messages = Message.objects.select_related('room', 'user').order_by('-created_at')[:limit]

            if not messages.exists():
                return return_class({
                    "data": {},
                    "message": "No recent activities found.",
                    "status": SUCCESS_RESPONSE_CODE
                })

            # Prepare the response data
            data = [
                {
                    "message_id": message.id,
                    "content": message.content,
                    "room": {
                        "room_id": message.room.id,
                        "room_name": message.room.name
                    },
                    "user": {
                        "user_id": message.user.id,
                        "username": message.user.username
                    },
                    "created_at": message.created_at
                }
                for message in messages
            ]

            return return_class({
                "data": data,
                "message": f"{len(data)} recent activities found.",
                "status": SUCCESS_RESPONSE_CODE
            })

        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while fetching recent activities.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })
