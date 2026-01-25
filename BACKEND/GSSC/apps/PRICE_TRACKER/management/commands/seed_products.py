from django.core.management.base import BaseCommand
from decimal import Decimal
from apps.PRICE_TRACKER.models import Product


class Command(BaseCommand):
    help = "Seed the database with solar panels, inverters, and batteries"

    def handle(self, *args, **options):
        products = [

            # ======================
            # SOLAR PANELS (5)
            # ======================
            Product(
                category="solar_panel",
                company="Jinko Solar",
                model="Tiger Neo N-Type 575W",
                price=Decimal("145.00"),
                cell_type="N-Type TOPCon",
                glass_thickness="3.2 mm",
                max_power="575W",
                max_system_voltage="1500V",
                operating_temperature="-40°C to +85°C",
                efficiency="22.3%",
                description="High-efficiency N-Type module with excellent low-light performance.",
                website="https://www.jinkosolar.com"
            ),
            Product(
                category="solar_panel",
                company="LONGi",
                model="Hi-MO 6 Explorer 560W",
                price=Decimal("138.00"),
                cell_type="HPBC",
                glass_thickness="3.2 mm",
                max_power="560W",
                max_system_voltage="1500V",
                operating_temperature="-40°C to +85°C",
                efficiency="22.0%",
                description="Premium monocrystalline panel optimized for utility-scale projects.",
                website="https://www.longi.com"
            ),
            Product(
                category="solar_panel",
                company="Trina Solar",
                model="Vertex N 600W",
                price=Decimal("155.00"),
                cell_type="N-Type TOPCon",
                glass_thickness="3.2 mm",
                max_power="600W",
                max_system_voltage="1500V",
                operating_temperature="-40°C to +85°C",
                efficiency="22.6%",
                description="Ultra-high power output panel for large installations.",
                website="https://www.trinasolar.com"
            ),
            Product(
                category="solar_panel",
                company="Canadian Solar",
                model="HiKu7 Mono PERC 545W",
                price=Decimal("130.00"),
                cell_type="Mono PERC",
                glass_thickness="3.2 mm",
                max_power="545W",
                max_system_voltage="1500V",
                operating_temperature="-40°C to +85°C",
                efficiency="21.3%",
                description="Reliable and cost-effective mono PERC solar panel.",
                website="https://www.canadiansolar.com"
            ),
            Product(
                category="solar_panel",
                company="JA Solar",
                model="DeepBlue 4.0 X 580W",
                price=Decimal("148.00"),
                cell_type="N-Type",
                glass_thickness="3.2 mm",
                max_power="580W",
                max_system_voltage="1500V",
                operating_temperature="-40°C to +85°C",
                efficiency="22.4%",
                description="Next-generation DeepBlue panel with high bifacial gains.",
                website="https://www.jasolar.com"
            ),

            # ======================
            # INVERTERS (5)
            # ======================
            Product(
                category="inverter",
                company="Huawei",
                model="SUN2000-100K-MAP0",
                price=Decimal("3200.00"),
                type="String Inverter",
                features="AI-powered arc fault protection, 12 MPPTs, 98.8% efficiency",
                description="Utility-scale smart inverter with advanced monitoring.",
                website="https://solar.huawei.com"
            ),
            Product(
                category="inverter",
                company="Sungrow",
                model="SG110CX",
                price=Decimal("3100.00"),
                type="String Inverter",
                features="12 MPPTs, IP66, high efficiency",
                description="High-performance inverter for commercial PV systems.",
                website="https://www.sungrowpower.com"
            ),
            Product(
                category="inverter",
                company="Growatt",
                model="MAX 125KTL3-X LV",
                price=Decimal("2950.00"),
                type="String Inverter",
                features="10 MPPTs, smart IV curve scanning",
                description="Cost-effective inverter for large rooftop projects.",
                website="https://www.growatt.com"
            ),
            Product(
                category="inverter",
                company="SMA",
                model="Sunny Tripower CORE2",
                price=Decimal("3500.00"),
                type="String Inverter",
                features="12 MPPTs, SMA Smart Connected",
                description="Premium German-engineered commercial inverter.",
                website="https://www.sma.de"
            ),
            Product(
                category="inverter",
                company="Fronius",
                model="Tauro Eco 100-3-D",
                price=Decimal("3400.00"),
                type="String Inverter",
                features="Dual MPPT, active cooling",
                description="Robust inverter designed for harsh environments.",
                website="https://www.fronius.com"
            ),

            # ======================
            # BATTERIES (5)
            # ======================
            Product(
                category="battery",
                company="BYD",
                model="Battery-Box Premium HVM 13.8",
                price=Decimal("8200.00"),
                type="Lithium Iron Phosphate (LFP)",
                features="Modular design, long cycle life",
                description="High-voltage residential and commercial battery system.",
                website="https://www.byd.com"
            ),
            Product(
                category="battery",
                company="Tesla",
                model="Powerwall 2",
                price=Decimal("8500.00"),
                type="Lithium-Ion",
                features="13.5 kWh, app monitoring, backup power",
                description="Popular home battery with seamless Tesla ecosystem.",
                website="https://www.tesla.com"
            ),
            Product(
                category="battery",
                company="LG Energy Solution",
                model="RESU 16H Prime",
                price=Decimal("7800.00"),
                type="Lithium-Ion",
                features="High energy density, compact design",
                description="Premium residential energy storage solution.",
                website="https://www.lgessbattery.com"
            ),
            Product(
                category="battery",
                company="Pylontech",
                model="US5000",
                price=Decimal("3600.00"),
                type="Lithium Iron Phosphate (LFP)",
                features="4.8 kWh, scalable, long lifespan",
                description="Widely used modular battery for solar storage.",
                website="https://www.pylontech.com.cn"
            ),
            Product(
                category="battery",
                company="Huawei",
                model="LUNA2000-15-S0",
                price=Decimal("7400.00"),
                type="Lithium Iron Phosphate (LFP)",
                features="Modular, smart energy management",
                description="Smart battery system designed for Huawei inverters.",
                website="https://solar.huawei.com"
            ),
        ]

        for product in products:
            product.save()  

        self.stdout.write(self.style.SUCCESS("✅ Successfully seeded products database"))
