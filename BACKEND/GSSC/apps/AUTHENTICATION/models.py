from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True)
    usertype = models.CharField(
        max_length=10,
        choices=USER_TYPES,
        default='user'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
