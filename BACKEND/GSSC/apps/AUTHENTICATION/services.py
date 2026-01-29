import random
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

from .models import EmailOTP


def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"


def send_otp_email(user):
    otp_code = generate_otp()

    expires_at = timezone.now() + timedelta(minutes=10)

    EmailOTP.objects.update_or_create(
        user=user,
        defaults={
            "otp": otp_code,
            "expires_at": expires_at
        }
    )

    send_mail(
        subject="Your GSSC OTP Code",
        message=(
            f"Your OTP code is {otp_code}.\n\n"
            f"This code will expire in 10 minutes.\n\n"
            f"If you did not request this, please ignore this email."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
