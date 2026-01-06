import math

'''
What my Input Dictionary should look like:
{
    'bulb': {'power_watts': 60, 'quantity': 10, 'hours_per_day': 5},
    'fan': {'power_watts': 100, 'quantity': 5, 'hours_per_day': 8},
    'ac': {'power_watts': 2000, 'quantity': 2, 'hours_per_day': 6}, 
    'heater': {'power_watts': 1500, 'quantity': 1, 'hours_per_day': 4},
    'fridge': {'power_watts': 800, 'quantity': 1, 'hours_per_day': 24},
}

What my Output Dictionary should look like:
{
    'system_requirements':{
        'total_daily_kwh': 56.2,
        'solar_panel_quantity': 50,
        'inverter_capacity_kw': 5.0,
        'battery_capacity_kwh': 20.0,
    }
}
'''

import math

def hourly_power_consumption(
    appliances: dict,
) -> float:
    total_hourly_wh = 0.0

    for specs in appliances.values():
        power = specs["power_watts"]
        quantity = specs["quantity"]

        hourly_wh = power * quantity
        total_hourly_wh += hourly_wh

    return total_hourly_wh

def max_inverter_capacity_kw(
    total_hourly_wh: float,
) -> float:
    return round(total_hourly_wh / 1000, 2)

def power_to_panel_morning_load(
    panel_watt: int = 550,
    total_hourly_wh: float = 0.0,
) -> dict:
    
    system_loss_factor: float = 1.30
    sun_hours_per_day: int = 8


    # Solar panels required
    adjusted_hourly_wh = total_hourly_wh * system_loss_factor
    solar_panel_quantity = math.ceil(adjusted_hourly_wh / panel_watt)

    # Morning energy requirement (kWh)
    total_morning_kwh = round((total_hourly_wh * sun_hours_per_day) / 1000, 2)

    return {
        "system_requirements": {
            "total_morning_kwh": round(total_morning_kwh, 2),
            "morning_solar_panel_quantity": solar_panel_quantity,
        }
    }


#=============================================================
# STILL IN PROGRESS - NEEDS TESTING AND VERIFICATION
#=============================================================
def power_to_panel_night_load(
    panel_watt: int = 550,
    total_hourly_wh: float = 0.0,
    backup_hours: int = 4,
) -> dict:
    
    total_night_kwh = 0.0
    system_loss_factor: float = 1.30

    # Solar panels required
    adjusted_hourly_wh = total_hourly_wh * system_loss_factor
    solar_panel_quantity = math.ceil(adjusted_hourly_wh / panel_watt)

    return {
        "system_requirements": {
            "total_night_kwh": round(total_night_kwh, 2),
            "night_solar_panel_quantity": solar_panel_quantity,
        }
    }

#=============================================================
# STILL IN PROGRESS - NEEDS TESTING AND VERIFICATION
#=============================================================
def power_to_panel_full_day_load(
    appliances: dict,
    panel_watt: int = 550,
    total_hourly_wh: float = 0.0,
    backup_hours: int = 4,
) -> dict:
    
    total_hourly_wh = hourly_power_consumption(appliances)
    inverter_capacity_kw = max_inverter_capacity_kw(total_hourly_wh)

    morning_load = power_to_panel_morning_load(
        panel_watt=panel_watt,
        total_hourly_wh=total_hourly_wh,
    )

    night_load = power_to_panel_night_load(
        panel_watt=panel_watt,
        total_hourly_wh=total_hourly_wh,
        backup_hours=backup_hours,
    )

    solar_panel_quantity = sum(
        morning_load["system_requirements"]["morning_solar_panel_quantity"],
        night_load["system_requirements"]["night_solar_panel_quantity"],
    )

    total_daily_kwh = sum(
        morning_load["system_requirements"]["total_morning_kwh"],
        night_load["system_requirements"]["total_night_kwh"],
    )

    system_loss_factor: float = 1.30
    sun_hours_per_day: int = 8

    # Solar panels required

    # Daily energy requirement (kWh)
    total_daily_kwh = round((total_hourly_wh * 24) / 1000, 2)

    return {
        "system_requirements": {
            "total_daily_kwh": round(total_daily_kwh, 2),
            "solar_panel_quantity": solar_panel_quantity,
        }
    }


def panel_to_power_calculation(
    solar_panel_quantity: int,
    panel_watt: int = 550,
    sun_hours_per_day: int = 8,
) -> dict:
    
    total_daily_kwh = round(
        (solar_panel_quantity * panel_watt * sun_hours_per_day) / 1000, 2
    )

    inverter_capacity_kw = round((solar_panel_quantity * panel_watt) / 1000, 2)

    battery_capacity_kwh = round(total_daily_kwh * 0.4, 2)

    return {
        "system_requirements": {
            "total_daily_kwh": total_daily_kwh,
            "inverter_capacity_kw": inverter_capacity_kw,
            "battery_capacity_kwh": battery_capacity_kwh,
        }
    }