from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='home'),
    path('nothing/', views.process_click, name='process_click'),
]
