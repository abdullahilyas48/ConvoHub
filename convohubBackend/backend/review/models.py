from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User

class Course(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Teacher(models.Model):
    name = models.CharField(max_length=255)
    courses = models.ManyToManyField(Course, related_name="teachers")

    def __str__(self):
        return self.name


class TeacherReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="reviews")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="reviews")
    teaching_style = models.FloatField(validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    marking = models.FloatField(validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    additional_remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Review for {self.teacher.name} by {self.user.username} in {self.course.name}"

    class Meta:
        unique_together = ("user", "teacher", "course")