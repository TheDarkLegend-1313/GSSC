from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.price_tracker_view, name='price_tracker_url'),
]
