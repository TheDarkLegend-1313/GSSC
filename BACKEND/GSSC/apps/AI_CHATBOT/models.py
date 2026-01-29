from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class UserChat(models.Model):
    """
    Stores the last conversation of a user.
    One row per user.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="chat"
    )

    # Example structure:
    # {
    #   "response1": {"userresponse": "...", "airesponse": "..."},
    #   "response2": {...}
    # }
    chat_data = models.JSONField(default=dict)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Chat for {self.user.username}"
