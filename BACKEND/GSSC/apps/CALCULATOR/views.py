from django.shortcuts import render

# Create your views here.
def calculator_view(request):
    # Placeholder for processing click events
    return render(request, 'calculator.html')

def power_to_panel_view(request):
    # Placeholder for processing click events
    return render(request, 'power_to_panel_calculator.html')

def panel_to_power_view(request):
    # Placeholder for processing click events
    return render(request, 'panel_to_power_calculator.html')
