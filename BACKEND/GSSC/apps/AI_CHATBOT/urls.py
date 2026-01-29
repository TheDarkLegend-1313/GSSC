from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("chat/", views.get_old_chat, name="get_old_chat"),
    path("message/", views.send_message, name="send_message"),
]
