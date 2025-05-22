# chat/routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/chat/<str:pk>/', consumers.RoomChatConsumer.as_asgi()),
]
