from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from .constants import SUCCESS_RESPONSE_CODE, BAD_REQUEST_CODE
from .decorators import return_class

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            
            user = request.user
            outstanding_tokens = OutstandingToken.objects.filter(user=user)

            if not outstanding_tokens.exists():
                return return_class({
                    "message": "No refresh tokens found for the user.",
                    "status": BAD_REQUEST_CODE,
                    "success": False,
                    "data": {}
                })

            for token in outstanding_tokens:
                try:
                    refresh_token = RefreshToken(token.token)
                    refresh_token.blacklist()
                except Exception:
                    continue 

            return return_class({
                "message": "Successfully logged out.",
                "status": SUCCESS_RESPONSE_CODE,
                "success": True,
                "data": {}
            })

        except Exception as e:
            return return_class({
                "message": "Something went wrong during logout.",
                "status": BAD_REQUEST_CODE,
                "success": False,
                "data": {"error": str(e)}
            })
