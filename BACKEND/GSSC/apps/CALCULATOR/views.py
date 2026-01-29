from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .services import power_to_panel_calculator, panel_to_power_calculator
from .models import SolarPanelCalculation, PowerCalculation
from .serializers import SolarPanelCalculationSerializer, PowerCalculationSerializer


# ===============================
# PANEL CALCULATOR (PUBLIC)
# ===============================
@api_view(['POST'])
@permission_classes([AllowAny])
def panel_calculator_view(request):
    try:
        appliances = request.data.get('appliances')
        panel_watt = request.data.get('panel_watt')
        backup_hours = request.data.get('backup_hours', 0)

        if appliances is None or panel_watt is None:
            return Response(
                {"error": "appliances and panel_watt are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        panel_watt = int(panel_watt)
        backup_hours = int(backup_hours)

        result = power_to_panel_calculator(
            appliances=appliances,
            panel_watt=panel_watt,
            backup_hours=backup_hours
        )

        system = result["system_requirements"]

        # ✅ SAVE ONLY IF USER IS LOGGED IN
        if request.user.is_authenticated:
            SolarPanelCalculation.objects.update_or_create(
                user=request.user,
                defaults={
                    "appliances": appliances,
                    "panel_watt": panel_watt,
                    "backup_hours": backup_hours,
                    "max_inverter_capacity": system["max_inverter_capacity"],
                    "total_daily_power_kwh": system["total_daily_power_kwh"],
                    "solar_panel_quantity": system["solar_panel_quantity"],
                }
            )

        # ✅ Always return calculation result
        return Response(
            {
                "max_inverter_capacity": system["max_inverter_capacity"],
                "total_daily_power_kwh": system["total_daily_power_kwh"],
                "solar_panel_quantity": system["solar_panel_quantity"],
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        print("🔥 PANEL ERROR:", e)
        return Response(
            {"error": "Internal server error", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ===============================
# POWER CALCULATOR (PUBLIC)
# ===============================
@api_view(['POST'])
@permission_classes([AllowAny])
def power_calculator_view(request):
    try:
        solarpanel_quantity = request.data.get('solarpanel_quantity')
        panelwatt = request.data.get('panelwatt')
        backup_hours = request.data.get('backup_hours', 0)

        if solarpanel_quantity is None or panelwatt is None:
            return Response(
                {"error": "solarpanel_quantity and panelwatt are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        solarpanel_quantity = int(solarpanel_quantity)
        panelwatt = int(panelwatt)
        backup_hours = int(backup_hours)

        result = panel_to_power_calculator(
            solar_panel_quantity=solarpanel_quantity,
            panel_watt=panelwatt,
            backup_hours=backup_hours
        )

        system = result["system_requirements"]

        # ✅ SAVE ONLY IF USER IS LOGGED IN
        if request.user.is_authenticated:
            PowerCalculation.objects.update_or_create(
                user=request.user,
                defaults={
                    "solarpanel_quantity": solarpanel_quantity,
                    "panelwatt": panelwatt,
                    "backup_hours": backup_hours,
                    "usable_power_kwh": system["usable_power_kwh"],
                    "total_daily_power_kwh": system["total_daily_power_kwh"],
                    "inverter_capacity_kwh": system["inverter_capacity_kw"],
                    "battery_capacity_kwh": system["battery_capacity_kwh"],
                }
            )

        return Response(
            {
                "usable_power_kwh": system["usable_power_kwh"],
                "total_daily_power_kwh": system["total_daily_power_kwh"],
                "inverter_capacity_kwh": system["inverter_capacity_kw"],
                "battery_capacity_kwh": system["battery_capacity_kwh"],
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        print("🔥 POWER ERROR:", e)
        return Response(
            {"error": "Internal server error", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
