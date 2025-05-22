from rest_framework import serializers
from .models import Course, Teacher,TeacherReview
from better_profanity import profanity


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name']  

class TeacherSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True)  

    class Meta:
        model = Teacher
        fields = ['id', 'name', 'courses']


class TeacherReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherReview
        fields = ['id', 'user', 'teacher', 'course', 'teaching_style', 'marking', 'additional_remarks']

    def validate_additional_remarks(self, value):

        if value and profanity.contains_profanity(value):
            raise serializers.ValidationError("Your remarks contain inappropriate language.")
        return value