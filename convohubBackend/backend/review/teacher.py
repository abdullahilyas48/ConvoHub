from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Teacher, Course
from .serializers import TeacherSerializer
from authentication.decorators import return_class
from authentication.constants import SUCCESS_RESPONSE_CODE, BAD_REQUEST_CODE, FORBIDDEN_CODE, INTERNAL_SERVER_ERROR_CODE


class TeacherViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    def has_superuser_access(self, request):
        if not request.user.is_superuser:
            return return_class({
                "data": {},
                "message": "You do not have permission to access this resource.",
                "status": FORBIDDEN_CODE
            }), False
        return None, True

    def list(self, request):
        try:
            teachers = Teacher.objects.all()
            serializer = TeacherSerializer(teachers, many=True)
            return return_class({
                "data": serializer.data,
                "message": "Teacher(s) retrieved successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })
        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while retrieving teachers.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })

    def retrieve(self, request, pk=None):
        try:
            teacher = Teacher.objects.get(pk=pk)
            serializer = TeacherSerializer(teacher)
            return return_class({
                "data": serializer.data,
                "message": "Teacher retrieved successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })
        except Teacher.DoesNotExist:
            return return_class({
                "data": {},
                "message": "Teacher not found.",
                "status": BAD_REQUEST_CODE
            })
        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while retrieving the teacher.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })

    def create(self, request):
        response, is_allowed = self.has_superuser_access(request)
        if not is_allowed:
            return response

        try:
            name = request.data.get('name')
            course_ids = request.data.get('course_ids', [])

            if not name or not isinstance(course_ids, list):
                return return_class({
                    "data": {},
                    "message": "Invalid data. 'name' and 'course_ids' are required.",
                    "status": BAD_REQUEST_CODE
                })

            courses = Course.objects.filter(id__in=course_ids)
            if not courses.exists():
                return return_class({
                    "data": {},
                    "message": "One or more courses not found.",
                    "status": BAD_REQUEST_CODE
                })

            teacher = Teacher.objects.create(name=name)
            teacher.courses.set(courses)
            teacher.save()

            serializer = TeacherSerializer(teacher)
            return return_class({
                "data": serializer.data,
                "message": "Teacher created successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })
        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while creating the teacher.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })

    def update(self, request, pk=None):
        response, is_allowed = self.has_superuser_access(request)
        if not is_allowed:
            return response

        try:
            teacher = Teacher.objects.get(pk=pk)
            name = request.data.get('name', teacher.name)
            course_ids = request.data.get('course_ids', [])

            if not isinstance(course_ids, list):
                return return_class({
                    "data": {},
                    "message": "Invalid data. 'course_ids' must be a list.",
                    "status": BAD_REQUEST_CODE
                })

            courses = Course.objects.filter(id__in=course_ids)
            if not courses.exists():
                return return_class({
                    "data": {},
                    "message": "One or more courses not found.",
                    "status": BAD_REQUEST_CODE
                })

            teacher.name = name
            teacher.courses.set(courses)
            teacher.save()

            serializer = TeacherSerializer(teacher)
            return return_class({
                "data": serializer.data,
                "message": "Teacher updated successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })
        except Teacher.DoesNotExist:
            return return_class({
                "data": {},
                "message": "Teacher not found.",
                "status": BAD_REQUEST_CODE
            })
        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while updating the teacher.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })

    def destroy(self, request, pk=None):
        response, is_allowed = self.has_superuser_access(request)
        if not is_allowed:
            return response

        try:
            teacher = Teacher.objects.get(pk=pk)
            teacher.delete()
            return return_class({
                "data": {},
                "message": "Teacher deleted successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })
        except Teacher.DoesNotExist:
            return return_class({
                "data": {},
                "message": "Teacher not found.",
                "status": BAD_REQUEST_CODE
            })
        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while deleting the teacher.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })
