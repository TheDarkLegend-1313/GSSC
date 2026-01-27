from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Quotation(models.Model):
    """
    Only ONE quotation allowed per user
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="quotation"
    )

    items = models.JSONField()  # stores full quotation table
    roi = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    estimated_total_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Quotation for {self.user}"
