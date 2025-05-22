from django.contrib import admin
from .models import Teacher,Course,TeacherReview
# Register your models here.

admin.site.register(Course)
admin.site.register(Teacher)
admin.site.register(TeacherReview)