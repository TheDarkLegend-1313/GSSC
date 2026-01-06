from django.shortcuts import render

# Create your views here.
def calculator_view(request):
    # Placeholder for processing click events
    return render(request, 'dashboard/calculator.html')

def power_to_panel_view(request):
    # Placeholder for processing click events
    return render(request, 'dashboard/power_to_panel_calculator.html')

def panel_to_power_view(request):
    # Placeholder for processing click events
    return render(request, 'dashboard/panel_to_power_calculator.html')
