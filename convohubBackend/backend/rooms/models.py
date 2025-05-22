from django.contrib.auth.models import User
from django.db import models


class Room(models.Model):
    name = models.CharField(max_length=255, default='New Room')
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_rooms')
    members = models.ManyToManyField(User, related_name='joined_rooms')
    topic = models.CharField(max_length=255,default='')
    description = models.TextField(default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (Host: {self.host.username})"
    
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Ensure the host is added as a member
        self.members.add(self.host)
