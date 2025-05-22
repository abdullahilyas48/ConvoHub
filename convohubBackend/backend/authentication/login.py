from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from .models import User
from .constants import BAD_REQUEST_CODE, SUCCESS_RESPONSE_CODE
from .decorators import return_class  

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            data = request.data
            username = data.get('username')
            password = data.get('password')
            response_ = {}

            if not username or not password:
                response_ = {
                    "message": "Username and password are required",
                    "status": BAD_REQUEST_CODE,
                    "success": False,
                    "data": {}
                }
                return return_class(response_)

            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                response_ = {
                    "message": "Not Registered",
                    "status": BAD_REQUEST_CODE,
                    "success": False,
                    "data": {}
                }
                return return_class(response_)

            # Authenticate user
            user = authenticate(username=username, password=password)
            if user:
                # Generate tokens using SimpleJWT
                refresh = RefreshToken.for_user(user)
                data = {
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "username": username
                }
                response_ = {
                    "message": "Success",
                    "status": SUCCESS_RESPONSE_CODE,
                    "success": True,
                    "data": data
                }
                return return_class(response_)
            else:
                response_ = {
                    "message": "Incorrect password",
                    "status": BAD_REQUEST_CODE,
                    "success": False,
                    "data": {}
                }
                return return_class(response_)
        except Exception as e:
            print(e)
            response_ = {
                "message": "Something went wrong",
                "status": BAD_REQUEST_CODE,
                "success": False,
                "data": {}
            }
            return return_class(response_)
