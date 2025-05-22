from django.urls import path
from .views import RoomListView, RoomDetailView, RoomCreateView
from .join_room import JoinRoomView
from .search_room import SearchRoomView
from .recent_activity import RecentActivitiesAPIView
urlpatterns = [
    path('create/', RoomCreateView.as_view(), name='room-create'),
    path('', RoomListView.as_view(), name='room-list'),
    path('<int:pk>/', RoomDetailView.as_view(), name='room-detail'),
    path('<int:pk>/join/', JoinRoomView.as_view(), name='join-room'),
    path('search/',SearchRoomView.as_view(),name='search-room'),
    path('recent/',RecentActivitiesAPIView.as_view(),name='recent-activity')
]
