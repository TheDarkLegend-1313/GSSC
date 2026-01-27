from decimal import Decimal


def calculate_totals(items):
    """
    Calculates total price and dummy ROI
    """
    total_price = Decimal("0.00")

    for item in items:
        if item.get("enabled"):
            total_price += Decimal(str(item.get("totalPrice", 0)))

    # Dummy ROI logic (replace with real solar math later)
    roi = Decimal("15.00") if total_price > 0 else Decimal("0.00")

    return {
        "estimated_total_price": total_price,
        "roi": roi
    }
