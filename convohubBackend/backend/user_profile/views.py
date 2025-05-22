from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from authentication.models import UserProfile
from django.db.models import Q
from authentication.decorators import return_class
from authentication.constants import SUCCESS_RESPONSE_CODE, BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_profile = UserProfile.objects.filter(user=request.user).first()
            if not user_profile:
                return return_class({
                    "data": {},
                    "message": "User profile not found.",
                    "status": BAD_REQUEST_CODE
                })

            data = {
                "email": request.user.email,
                "username": request.user.username,
                "bio": user_profile.bio,
                "profile_image": user_profile.profile_image.url if user_profile.profile_image else None
            }

            return return_class({
                "data": data,
                "message": "User profile retrieved successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })
        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while retrieving the profile.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })

    def put(self, request):
        try:
            user_profile = UserProfile.objects.filter(user=request.user).first()
            if not user_profile:
                return return_class({
                    "data": {},
                    "message": "User profile not found.",
                    "status": BAD_REQUEST_CODE
                })

            bio = request.data.get('bio', None)
            profile_image = request.FILES.get('profile_image', None)

            if bio is not None:
                user_profile.bio = bio

            if profile_image:
                user_profile.profile_image = profile_image

            user_profile.save()

            data = {
                "username": request.user.username,
                "bio": user_profile.bio,
                "profile_image": user_profile.profile_image.url if user_profile.profile_image else None
            }

            return return_class({
                "data": data,
                "message": "User profile updated successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })
        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while updating the profile.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })
