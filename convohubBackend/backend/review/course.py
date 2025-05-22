from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Course
from .serializers import CourseSerializer
from authentication.decorators import return_class
from authentication.constants import SUCCESS_RESPONSE_CODE, BAD_REQUEST_CODE, FORBIDDEN_CODE, INTERNAL_SERVER_ERROR_CODE


class CourseAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def has_superuser_access(self, request):
        if not request.user.is_superuser:
            return return_class({
                "data": {},
                "message": "You do not have permission to access this resource.",
                "status": FORBIDDEN_CODE
            }), False
        return None, True

    def get(self, request, pk=None):
        try:
            if pk:
                course = Course.objects.get(pk=pk)
                serializer = CourseSerializer(course)
                data = serializer.data
            else:
                courses = Course.objects.all()
                serializer = CourseSerializer(courses, many=True)
                data = serializer.data

            return return_class({
                "data": data,
                "message": "Course(s) retrieved successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })

        except Course.DoesNotExist:
            return return_class({
                "data": {},
                "message": "Course not found.",
                "status": BAD_REQUEST_CODE
            })
        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while retrieving courses.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })

    def post(self, request):
        response, is_allowed = self.has_superuser_access(request)
        if not is_allowed:
            return response

        try:
            serializer = CourseSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return return_class({
                    "data": serializer.data,
                    "message": "Course created successfully.",
                    "status": SUCCESS_RESPONSE_CODE
                })
            return return_class({
                "data": serializer.errors,
                "message": "Invalid data.",
                "status": BAD_REQUEST_CODE
            })

        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while creating the course.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })

    def put(self, request, pk):
        response, is_allowed = self.has_superuser_access(request)
        if not is_allowed:
            return response

        try:
            course = Course.objects.get(pk=pk)
            serializer = CourseSerializer(course, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return return_class({
                    "data": serializer.data,
                    "message": "Course updated successfully.",
                    "status": SUCCESS_RESPONSE_CODE
                })
            return return_class({
                "data": serializer.errors,
                "message": "Invalid data.",
                "status": BAD_REQUEST_CODE
            })

        except Course.DoesNotExist:
            return return_class({
                "data": {},
                "message": "Course not found.",
                "status": BAD_REQUEST_CODE
            })
        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while updating the course.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })

    def delete(self, request, pk):
        response, is_allowed = self.has_superuser_access(request)
        if not is_allowed:
            return response

        try:
            course = Course.objects.get(pk=pk)
            course.delete()
            return return_class({
                "data": {},
                "message": "Course deleted successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })

        except Course.DoesNotExist:
            return return_class({
                "data": {},
                "message": "Course not found.",
                "status": BAD_REQUEST_CODE
            })
        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while deleting the course.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })
