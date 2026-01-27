from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import Product
from .serializers import ProductSerializer
from .pagination import ProductPagination

@method_decorator(csrf_exempt, name='dispatch')
class PriceTrackerListView(ListAPIView):
    """
    API endpoint for price tracker
    Frontend: GET /price-tracker/?filter=solar&page=1
    """
    serializer_class = ProductSerializer
    pagination_class = ProductPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()

        filter_value = self.request.query_params.get('filter')

        if filter_value:
            queryset = queryset.filter(
                Q(company__icontains=filter_value) |
                Q(model__icontains=filter_value) |
                Q(category__icontains=filter_value) |
                Q(type__icontains=filter_value)
            )

        return queryset

def update_prices_view(request):
    pass