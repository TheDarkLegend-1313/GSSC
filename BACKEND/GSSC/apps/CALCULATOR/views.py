# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import AllowAny

# from .services import power_to_panel_calculator, panel_to_power_calculator
# from .models import SolarPanelCalculation, PowerCalculation
# from .serializers import SolarPanelCalculationSerializer, PowerCalculationSerializer



# @api_view(['POST'])
# @permission_classes([AllowAny])
# def panel_calculator_view(request):
#     try:
#         appliances = request.data.get('appliances')
#         panel_watt = request.data.get('panel_watt')
#         backup_hours = request.data.get('backup_hours', 0)

#         if appliances is None or panel_watt is None:
#             return Response(
#                 {"error": "appliances and panel_watt are required"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         result = power_to_panel_calculator(
#             appliances=appliances,
#             panel_watt=panel_watt,
#             backup_hours=backup_hours
#         )

#         calculation = SolarPanelCalculation.objects.create(
#             appliances=appliances,
#             panel_watt=panel_watt,
#             backup_hours=backup_hours,
#             max_inverter_capacity=result['max_inverter_capacity'],
#             total_daily_power_kwh=result['total_daily_power_kwh'],
#             solar_panel_quantity=result['solar_panel_quantity']
#         )

#         serializer = SolarPanelCalculationSerializer(calculation)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     except Exception as e:
#         return Response(
#             {"error": str(e)},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def power_calculator_view(request):
#     try:
#         solarpanel_quantity = request.data.get('solarpanel_quantity')
#         panelwatt = request.data.get('panelwatt')
#         backup_hours = request.data.get('backup_hours', 0)

#         if solarpanel_quantity is None or panelwatt is None:
#             return Response(
#                 {"error": "solarpanel_quantity and panelwatt are required"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         result = panel_to_power_calculator(
#             solarpanel_quantity=solarpanel_quantity,
#             panelwatt=panelwatt,
#             backup_hours=backup_hours
#         )

#         calculation = PowerCalculation.objects.create(
#             solarpanel_quantity=solarpanel_quantity,
#             panelwatt=panelwatt,
#             backup_hours=backup_hours,
#             usable_power_kwh=result['usable_power_kwh'],
#             total_daily_power_kwh=result['total_daily_power_kwh'],
#             inverter_capacity_kwh=result['inverter_capacity_kwh'],
#             battery_capacity_kwh=result['battery_capacity_kwh']
#         )

#         serializer = PowerCalculationSerializer(calculation)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     except Exception as e:
#         return Response(
#             {"error": str(e)},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

# We keep these imports so the file doesn't crash, 
# even though we aren't using them for the dummy response.
try:
    from .models import SolarPanelCalculation, PowerCalculation
    from .serializers import SolarPanelCalculationSerializer, PowerCalculationSerializer
except ImportError:
    pass 

@api_view(['POST'])
@permission_classes([AllowAny])
def panel_calculator_view(request):
    """
    Returns a dummy response for the Panel Calculator
    """
    try:
        # Just printing to your terminal so you can see what the frontend sent
        print("Data received in Panel View:", request.data)

        # Hardcoded dummy response
        dummy_data = {
            "id": 999,
            "appliances": request.data.get('appliances', []),
            "panel_watt": request.data.get('panel_watt', 550),
            "backup_hours": request.data.get('backup_hours', 0),
            "max_inverter_capacity": 5.5,
            "total_daily_power_kwh": 12.45,
            "solar_panel_quantity": 8,
            "message": "This is a dummy response for testing frontend connection"
        }

        return Response(dummy_data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": f"Backend Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def power_calculator_view(request):
    """
    Returns a dummy response for the Power Calculator
    """
    try:
        # Just printing to your terminal
        print("Data received in Power View:", request.data)

        # Hardcoded dummy response
        dummy_data = {
            "id": 888,
            "solarpanel_quantity": request.data.get('solarpanel_quantity', 1),
            "panelwatt": request.data.get('panelwatt', 550),
            "backup_hours": request.data.get('backup_hours', 0),
            "usable_power_kwh": 3.2,
            "total_daily_power_kwh": 25.0,
            "inverter_capacity_kwh": 5.0,
            "battery_capacity_kwh": 10.0,
            "message": "This is a dummy response for testing frontend connection"
        }

        return Response(dummy_data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": f"Backend Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)