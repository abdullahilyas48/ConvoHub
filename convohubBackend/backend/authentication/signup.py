from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from .models import User, UserProfile
from .constants import BAD_REQUEST_CODE, SUCCESS_RESPONSE_CODE
from .validate_email import validate_email
from .decorators import return_class 

class SignupView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            data = request.data
            username = data.get('username', '').strip()
            email = data.get('email', '').lower().strip()
            password = data.get('password', '').strip()
            response_ = {}

            # Validate username
            if not username or User.objects.filter(username=username).exists():
                response_ = {
                    "message": "Username already exists!",
                    "status": BAD_REQUEST_CODE,
                    "success": False,
                    "data": {}
                }
                return return_class(response_)

            # Validate email
            if not email or User.objects.filter(email=email).exists():
                response_ = {
                    "message": "Email already exists!",
                    "status": BAD_REQUEST_CODE,
                    "success": False,
                    "data": {}
                }
                return return_class(response_)

            if validate_email(email) == 'Invalid':
                response_ = {
                    "message": "Only NUCES email can be used to create an account",
                    "status": BAD_REQUEST_CODE,
                    "success": False,
                    "data": {}
                }
                return return_class(response_)

            # Create user and profile
            try:
                user, created = User.objects.get_or_create(username=username, email=email)
                user.set_password(password)
                user.save()
                UserProfile.objects.get_or_create(user=user)
            except Exception as e:
                print(e)
                response_ = {
                    "message": "Something went wrong",
                    "status": BAD_REQUEST_CODE,
                    "success": False,
                    "data": {}
                }
                return return_class(response_)

            # Generate tokens using SimpleJWT
            refresh = RefreshToken.for_user(user)
            data = {
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "username": username
            }
            response_ = {
                "message": "Successfully Registered!",
                "status": SUCCESS_RESPONSE_CODE,
                "success": True,
                "data": data
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
