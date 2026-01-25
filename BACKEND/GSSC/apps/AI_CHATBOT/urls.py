from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.ai_chatbot_view, name='ai_chatbot_url'),
]
