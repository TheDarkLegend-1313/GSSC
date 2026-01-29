from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from django.contrib.auth import get_user_model

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer
from .services import send_otp_email
from .models import EmailOTP

User = get_user_model()

# =====================================================
# REGISTER (CREATE USER BUT DO NOT ACTIVATE)
# =====================================================
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 🚫 Create inactive user
        user = serializer.save(is_active=False)

        # 🔐 Send OTP for email verification
        send_otp_email(user)

        return Response(
            {
                "message": "Registration successful. Please verify the OTP sent to your email.",
                "email": user.email
            },
            status=status.HTTP_201_CREATED
        )


# =====================================================
# REQUEST OTP (FOR REGISTER / FORGOT PASSWORD)
# =====================================================
@api_view(["POST"])
@permission_classes([AllowAny])
def request_otp_view(request):
    email = request.data.get("email")

    if not email:
        return Response(
            {"error": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
        send_otp_email(user)
    except User.DoesNotExist:
        # 🔐 Do NOT reveal whether email exists
        pass

    return Response(
        {"message": "If the account exists, an OTP has been sent."},
        status=status.HTTP_200_OK
    )


# =====================================================
# VERIFY OTP (ACTIVATE USER + ISSUE JWT)
# =====================================================
# @api_view(["POST"])
# @permission_classes([AllowAny])
# def verify_otp_view(request):
#     email = request.data.get("email")
#     otp = request.data.get("otp")

#     if not email or not otp:
#         return Response(
#             {"error": "Email and OTP are required"},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     try:
#         user = User.objects.get(email=email)
#     except User.DoesNotExist:
#         return Response(
#             {"error": "Invalid OTP or email"},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     try:
#         otp_record = user.email_otp
#     except EmailOTP.DoesNotExist:
#         return Response(
#             {"error": "OTP not found. Please request a new one."},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     # ❌ OTP expired
#     if otp_record.is_expired():
#         otp_record.delete()
#         return Response(
#             {"error": "OTP has expired. Please request a new one."},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     # ❌ OTP mismatch
#     if otp_record.otp != otp:
#         return Response(
#             {"error": "Invalid OTP"},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     # ✅ OTP verified → clean up
#     otp_record.delete()

#     # ✅ Activate user
#     if not user.is_active:
#         user.is_active = True
#         user.save(update_fields=["is_active"])

#     # 🔐 Issue JWT tokens
#     refresh = RefreshToken.for_user(user)

#     return Response(
#         {
#             "access_token": str(refresh.access_token),
#             "refresh_token": str(refresh),
#             "message": "OTP verified successfully"
#         },
#         status=status.HTTP_200_OK
#     )

@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp_view(request):
    email = request.data.get("email")
    otp = request.data.get("otp")
    purpose = request.data.get("purpose")  # "register" | "forgot_password"

    if not email or not otp:
        return Response(
            {"error": "Email and OTP are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
        otp_record = user.email_otp
    except (User.DoesNotExist, EmailOTP.DoesNotExist):
        return Response(
            {"error": "Invalid OTP or email"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if otp_record.is_expired():
        otp_record.delete()
        return Response(
            {"error": "OTP expired"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if otp_record.otp != otp:
        return Response(
            {"error": "Invalid OTP"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ OTP VALID
    if purpose == "forgot_password":
        otp_record.password_reset_allowed = True
        otp_record.save(update_fields=["password_reset_allowed"])

        return Response(
            {"message": "OTP verified. You may reset your password."},
            status=status.HTTP_200_OK
        )

    # 🔐 Registration flow
    otp_record.delete()
    user.is_active = True
    user.save(update_fields=["is_active"])

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "message": "Account verified successfully"
        },
        status=status.HTTP_200_OK
    )


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    user = request.user

    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not old_password or not new_password:
        return Response(
            {"error": "Old password and new password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ❌ Check old password
    if not user.check_password(old_password):
        return Response(
            {"error": "Current password is incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ❌ Prevent same password
    if old_password == new_password:
        return Response(
            {"error": "New password must be different from current password"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ❌ Validate new password (Django validators)
    try:
        validate_password(new_password, user=user)
    except ValidationError as e:
        return Response(
            {"error": e.messages},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ Set new password
    user.set_password(new_password)
    user.save()

    return Response(
        {"message": "Password changed successfully!"},
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password_view(request):
    email = request.data.get("email")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if not email or not new_password or not confirm_password:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if new_password != confirm_password:
        return Response(
            {"error": "Passwords do not match"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
        otp_record = user.email_otp
    except (User.DoesNotExist, EmailOTP.DoesNotExist):
        return Response(
            {"error": "Password reset not allowed"},
            status=status.HTTP_403_FORBIDDEN
        )

    # 🔐 HARD SECURITY CHECK
    if not otp_record.password_reset_allowed:
        return Response(
            {"error": "OTP verification required"},
            status=status.HTTP_403_FORBIDDEN
        )

    # Validate password strength
    try:
        validate_password(new_password, user=user)
    except ValidationError as e:
        return Response(
            {"error": e.messages},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ RESET PASSWORD
    user.set_password(new_password)
    user.save()

    # 🔥 Consume permission (ONE-TIME)
    otp_record.delete()

    return Response(
        {"message": "Password reset successfully. Please login."},
        status=status.HTTP_200_OK
    )
