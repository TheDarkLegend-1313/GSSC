from django.urls import path
from .views import (
    QuotationOptionsView,
    CalculateQuotationView,
    SaveQuotationView,
    RequestOldQuotationView,
    EmailQuotationView,
)

urlpatterns = [
    path("options/", QuotationOptionsView.as_view()),
    path("calculate/", CalculateQuotationView.as_view()),
    path("save/", SaveQuotationView.as_view()),
    path("old/", RequestOldQuotationView.as_view()),
    path("email/", EmailQuotationView.as_view()),
]
