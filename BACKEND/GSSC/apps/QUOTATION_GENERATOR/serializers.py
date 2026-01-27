from rest_framework import serializers
from .models import Quotation


class QuotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quotation
        fields = [
            "id",
            "items",
            "roi",
            "estimated_total_price",
            "created_at",
            "updated_at",
        ]
