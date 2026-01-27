from rest_framework import serializers
from .models import SolarPanelCalculation, PowerCalculation


class SolarPanelCalculationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolarPanelCalculation
        fields = '__all__'


class PowerCalculationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PowerCalculation
        fields = '__all__'