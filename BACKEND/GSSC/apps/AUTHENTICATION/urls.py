from django.urls import path 
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from . import views

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path("request-otp/", views.request_otp_view),
    path("verify-otp/", views.verify_otp_view),
    path("reset-password/", views.reset_password_view),
    path("change-password/", views.change_password_view),
]
