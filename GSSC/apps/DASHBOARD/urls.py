from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='dashboard_url'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
]
