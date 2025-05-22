from django.urls import path
from .login import LoginView
from .signup import SignupView
from .logout import LogoutView
urlpatterns = [
    path('login/',LoginView.as_view()),
    path('signup/',SignupView.as_view()),
    path('logout/',LogoutView.as_view())
]