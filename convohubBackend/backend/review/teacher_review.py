from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import TeacherReview
from .serializers import TeacherReviewSerializer
from authentication.decorators import return_class
from authentication.constants import SUCCESS_RESPONSE_CODE, BAD_REQUEST_CODE, FORBIDDEN_CODE, INTERNAL_SERVER_ERROR_CODE


class TeacherReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def has_superuser_access(self, request):
        if not request.user.is_superuser:
            return return_class({
                "data": {},
                "message": "You do not have permission to delete this resource.",
                "status": FORBIDDEN_CODE
            }), False
        return None, True

    def get(self, request):
        try:
            teacher_id = request.query_params.get('teacher_id')
            course_id = request.query_params.get('course_id')

            if not teacher_id or not course_id:
                return return_class({
                    "data": {},
                    "message": "Both 'teacher_id' and 'course_id' are required.",
                    "status": BAD_REQUEST_CODE
                })

            reviews = TeacherReview.objects.filter(teacher_id=teacher_id, course_id=course_id)
            serializer = TeacherReviewSerializer(reviews, many=True)

            return return_class({
                "data": serializer.data,
                "message": "Teacher reviews retrieved successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })

        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while retrieving reviews.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })

    def post(self, request):
        user = request.user
        teacher_id = request.data.get('teacher_id')
        course_id = request.data.get('course_id')
        teaching_style = request.data.get('teaching_style')
        marking = request.data.get('marking')
        additional_remarks = request.data.get('additional_remarks')

        
        if not (teacher_id and course_id and teaching_style and marking):
            return return_class({
                "data": {},
                "message": "Missing required fields: 'teacher_id', 'course_id', 'teaching_style', 'marking'.",
                "status": BAD_REQUEST_CODE
            })

        if TeacherReview.objects.filter(user=user, teacher_id=teacher_id, course_id=course_id).exists():
            return return_class({
                "data": {},
                "message": "You have already reviewed this teacher for this course.",
                "status": BAD_REQUEST_CODE
            })

        try:
            data = {
                "user": user.id,
                "teacher": teacher_id,
                "course": course_id,
                "teaching_style": teaching_style,
                "marking": marking,
                "additional_remarks": additional_remarks
            }
            serializer = TeacherReviewSerializer(data=data, context={'request': request})
            serializer.is_valid(raise_exception=True)  # Raise ValidationError if invalid
            serializer.save()

            return return_class({
                "data": serializer.data,
                "message": "Review added successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })

        except ValidationError as ve:
            
            return return_class({
                "data": ve.detail, 
                "message": "Immoral word detected in additional remarks",
                "status": BAD_REQUEST_CODE
            })

        except Exception as e:
            
            return return_class({
                "data": {"error": str(e)},
                "message": "An unexpected error occurred while adding the review.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })

    def delete(self, request, pk=None):
        response, is_allowed = self.has_superuser_access(request)
        if not is_allowed:
            return response

        try:
            review = TeacherReview.objects.get(pk=pk)
            review.delete()

            return return_class({
                "data": {},
                "message": "Review deleted successfully.",
                "status": SUCCESS_RESPONSE_CODE
            })

        except TeacherReview.DoesNotExist:
            return return_class({
                "data": {},
                "message": "Review not found.",
                "status": BAD_REQUEST_CODE
            })
        except Exception as e:
            return return_class({
                "data": {"error": str(e)},
                "message": "An error occurred while deleting the review.",
                "status": INTERNAL_SERVER_ERROR_CODE
            })
