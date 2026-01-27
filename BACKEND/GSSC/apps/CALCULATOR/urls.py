from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('power/', views.power_calculator_view, name="power_calculator"),
    path('panel/', views.panel_calculator_view, name="panel_calculator"),
]
