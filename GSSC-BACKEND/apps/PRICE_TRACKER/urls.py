from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.price_tracker_view, name='price_tracker_url'),
    path('update/', views.update_prices_view, name='update_prices_url'),
    path('update/success/', views.update_success_view, name='update_success_url'),
]
