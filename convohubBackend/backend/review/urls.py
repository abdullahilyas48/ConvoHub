from django.urls import path
from .course import CourseAPIView
from .teacher import TeacherViewSet
from .teacher_review import TeacherReviewView

urlpatterns = [
    # Course API
    path('courses/', CourseAPIView.as_view(), name='course-list'),  
    path('courses/<int:pk>/', CourseAPIView.as_view(), name='course-detail'),

    # Teacher API
    path('teachers/', TeacherViewSet.as_view({'get': 'list', 'post': 'create'}), name='teacher-list'),
    path('teachers/<int:pk>/', TeacherViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='teacher-detail'),

    # Teacher Review API
    path('teacher-reviews/', TeacherReviewView.as_view(), name='teacher-review-list'),  
    path('teacher-reviews/<int:pk>/', TeacherReviewView.as_view(), name='teacher-review-detail'),  
]
