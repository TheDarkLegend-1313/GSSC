from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.quotation_generator_view, name='quotation_generator_url'),
]
