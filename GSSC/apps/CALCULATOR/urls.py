from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.calculator_view, name='calculator_url'),
    path('power_to_panel_calculator', views.power_to_panel_view, name='power_to_panel'),
    path('panel_to_power_calculator', views.panel_to_power_view, name='panel_to_power'),
]