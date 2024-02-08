from django.db import models

# Create your models here


class Profile(models.Model):
    user_id = models.CharField(max_length=50, default="", unique=True)
    user_name = models.CharField(max_length=50, default="", unique=False)
    signup_date = models.DateTimeField(auto_now_add=True)
