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

Hourly Power = 6000 Wh = 6 kWh
Adjusted Hourly Power = 7800 Wh = 7.8 kWh
Solar Panels(650) = 12

Backup Hours = 6 
Total Backup Energy = 46.8 kWh
Backup Solar Panels(650) = 46.8/(0.65*8) = 9

We multiply the power of panel by 8 for backup because we assume that the solar panels will generate power for 8 hours a day.

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

#=============================================================
# CALCULATW MORNING LOAD REQUIREMENTS
#=============================================================

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
# CALCULATW NIGHT LOAD REQUIREMENTS
#=============================================================
def power_to_panel_night_load(
    panel_watt: int = 550,
    total_hourly_wh: float = 0.0,
    backup_hours: int = 4,
) -> dict:
    system_loss_factor: float = 1.30

    # Solar panels required
    adjusted_hourly_wh = total_hourly_wh * system_loss_factor
    total_night_wh = adjusted_hourly_wh * backup_hours
    solar_panel_quantity = math.ceil(total_night_wh / (panel_watt * 8))

    return {
        "system_requirements": {
            "total_night_kwh": round(total_night_wh / 1000, 2),
            "night_solar_panel_quantity": solar_panel_quantity,
        }
    }

#=============================================================
# CALCULATE TOTAL LOAD REQUIREMENTS
#=============================================================
def power_to_panel_full_day_load(
    appliances: dict,
    panel_watt: int = 550,
    backup_hours: int = 0,
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

    return {
        "system_requirements": {
            "max_inverter_capacity_kw": inverter_capacity_kw,
            "total_daily_kwh": round(total_daily_kwh, 2),
            "solar_panel_quantity": solar_panel_quantity,
        }
    }


'''
Let say we have 20 panels of 550W each.
We can calculate the total power generated in a day as follows:
20 x 550W x 8 hours x 0.7 (system loss factor) = 61,600 Wh = 61.6 kWh



let say x is the power we need during the day.
and y is the power we need for backup.
If we have z number of total panels and b hours of backup, and pw panel watt
then:

Power per day = z x pw x 8 x 0.7 = Total Daily kWh
Power per hour = z x pw x 0.7 = Wh

ppd = 20 x 550 x 8 x 0.7 = 61,600 Wh = 61.6 kWh
pph = 20 x 550 x 0.7 = 7,700 Wh

x + y = pph
8x + by = pph x 8

From the above two equations we can solve for x and y. Let b = 4
x + y = 7,700
8x + by = 61,600

Solving for x and y we get:
x = 8,462 - y
8(8,462 - y) + 4y = 61,600
67,696 - 8y + 4y = 61,600
-4y = -6,096

y = 1.52 kWh (Backup Power)
x = 8,462 - 1,520 = 6,942 Wh (Daytime Power)

what if,
ppd/b + 8

What if we want to calculate the power generated per day divided by backup hours plus 8?
61.6 / 4 + 8 = 15.4 kWh 

'''


#=============================================================
# CALCULATE TOTAL POWER FROM GIVEN NUMBER OF PANELS
#=============================================================

def panel_to_power_calculation(
    solar_panel_quantity: int,
    panel_watt: int = 550,   
    backup_hours: int = 0, 
) -> dict:
    
    sun_hours_per_day: int = 8
    system_loss_factor: float = 0.70

    total_hourly_wh = solar_panel_quantity * panel_watt * system_loss_factor
    
    usable_power_per_hour_wh = total_hourly_wh / (backup_hours + sun_hours_per_day)

    total_daily_kwh = round((total_hourly_wh * sun_hours_per_day) / 1000, 2)

    inverter_capacity_kw = round((solar_panel_quantity * panel_watt) / 1000, 2)

    battery_capacity_kwh = round(total_hourly_wh * backup_hours / 1000, 2)

    return {
        "system_requirements": {
            "usable_power_per_hour_kwh": round(usable_power_per_hour_wh / 1000, 2),
            "total_daily_kwh": total_daily_kwh,
            "inverter_capacity_kw": inverter_capacity_kw,
            "battery_capacity_kwh": battery_capacity_kwh,
        }
    }