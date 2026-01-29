from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class SolarPanelCalculation(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='solar_panel_calculation'
    )

    appliances = models.JSONField()
    panel_watt = models.IntegerField()
    backup_hours = models.IntegerField(default=0)

    max_inverter_capacity = models.FloatField()
    total_daily_power_kwh = models.FloatField()
    solar_panel_quantity = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Solar Panel Calculation - {self.user.username}"


class PowerCalculation(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='power_calculation'
    )

    solarpanel_quantity = models.IntegerField()
    panelwatt = models.IntegerField()
    backup_hours = models.IntegerField(default=0)

    usable_power_kwh = models.FloatField()
    total_daily_power_kwh = models.FloatField()
    inverter_capacity_kwh = models.FloatField()
    battery_capacity_kwh = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Power Calculation - {self.user.username}"
