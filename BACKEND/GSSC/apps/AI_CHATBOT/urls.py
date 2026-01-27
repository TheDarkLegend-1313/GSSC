from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.ai_chatbot_view, name="ai_chatbot"),
]
