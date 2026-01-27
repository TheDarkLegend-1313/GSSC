from django.core.management.base import BaseCommand
from APPS.PRICE_TRACKER.models import Product
from decimal import Decimal
import random


class Command(BaseCommand):
    help = "Seed database with sample Products (Solar Panels, Batteries, Inverters)"

    def handle(self, *args, **kwargs):
        Product.objects.all().delete()

        # ---------------- SOLAR PANELS ----------------
        solar_panels = [
            Product(
                category="solar_panel",
                company=f"SolarTech {i}",
                model=f"ST-{500+i}W",
                price=Decimal(random.randint(45000, 85000)),
                description="High efficiency mono-crystalline solar panel",
                website="https://example.com",
                cell_type="Monocrystalline",
                glass_thickness="3.2mm",
                max_power=f"{500+i}W",
                max_system_voltage="1500V",
                operating_temperature="-40°C to 85°C",
                efficiency=f"{20 + i * 0.1:.1f}%",
                type="Residential / Commercial",
                features="Anti-PID, High durability, Weather resistant",
            )
            for i in range(10)
        ]

        # ---------------- BATTERIES ----------------
        batteries = [
            Product(
                category="battery",
                company=f"PowerCell {i}",
                model=f"PC-{100+i}Ah",
                price=Decimal(random.randint(60000, 120000)),
                description="Deep cycle lithium battery",
                website="https://example.com",
                type="Lithium-ion",
                features="Long life cycle, Fast charging, Maintenance free",
            )
            for i in range(10)
        ]

        # ---------------- INVERTERS ----------------
        inverters = [
            Product(
                category="inverter",
                company=f"VoltMax {i}",
                model=f"VM-{3+i}KW",
                price=Decimal(random.randint(70000, 150000)),
                description="Pure sine wave hybrid inverter",
                website="https://example.com",
                type="Hybrid",
                features="MPPT, WiFi monitoring, Overload protection",
            )
            for i in range(10)
        ]

        Product.objects.bulk_create(solar_panels + batteries + inverters)

        self.stdout.write(self.style.SUCCESS("✅ Successfully seeded 30 products"))
