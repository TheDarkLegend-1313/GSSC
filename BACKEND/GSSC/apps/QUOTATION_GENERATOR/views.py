from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Quotation
from .serializers import QuotationSerializer
from .services import calculate_totals

from APPS.PRICE_TRACKER.models import Product


class QuotationOptionsView(APIView):
    """
    GET:
    Returns description + unit prices for quotation table
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {}

        # ---- Solar Panels ----
        panels = Product.objects.filter(category="solar_panel")
        data["Panel"] = {
            "descriptions": [
                f"{p.company} {p.model} ({p.max_power})"
                for p in panels
            ],
            "unitPrices": {
                f"{p.company} {p.model} ({p.max_power})": float(p.price or 0)
                for p in panels
            },
        }

        # ---- Inverters ----
        inverters = Product.objects.filter(category="inverter")
        data["Inverter"] = {
            "descriptions": [
                f"{i.company} {i.model}"
                for i in inverters
            ],
            "unitPrices": {
                f"{i.company} {i.model}": float(i.price or 0)
                for i in inverters
            },
        }

        # ---- Batteries ----
        batteries = Product.objects.filter(category="battery")
        data["Battery"] = {
            "descriptions": [
                f"{b.company} {b.model}"
                for b in batteries
            ],
            "unitPrices": {
                f"{b.company} {b.model}": float(b.price or 0)
                for b in batteries
            },
        }

        # ---- Fixed items ----
        fixed_items = [
            "Panel Mount Structure",
            "DB Box",
            "Tin Coated Cable",
            "AC Cable",
            "Installation Accessories",
            "AC/DC Earthing Bore",
            "Net Metering Green Meter",
        ]

        for item in fixed_items:
            data[item] = {
                "descriptions": ["Standard"],
                "unitPrices": {"Standard": 0},
            }

        return Response(data, status=status.HTTP_200_OK)

class CalculateQuotationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        items = request.data.get("items", [])

        results = calculate_totals(items)

        return Response({
            "roi": results["roi"],
            "estimatedTotalPrice": results["estimated_total_price"]
        })

class SaveQuotationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        items = request.data.get("items", [])

        results = calculate_totals(items)

        quotation, _ = Quotation.objects.update_or_create(
            user=request.user,
            defaults={
                "items": items,
                "roi": results["roi"],
                "estimated_total_price": results["estimated_total_price"],
            }
        )

        return Response({
            "message": "Quotation saved successfully"
        })

class RequestOldQuotationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            quotation = request.user.quotation
        except Quotation.DoesNotExist:
            return Response(
                {"message": "No previous quotation found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = QuotationSerializer(quotation)

        return Response({
            "message": "Old quotation retrieved successfully",
            "quotationData": serializer.data["items"]
        })

class EmailQuotationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # You can integrate Django Email / Celery later
        return Response({
            "message": "Quotation emailed successfully"
        })
