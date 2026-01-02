from django.shortcuts import render

# Create your views here.
def dashboard_view(request):
    return render(request, 'dashboard/dashboard.html')

def process_click(request):
    # Placeholder for processing click events
    return render(request, 'dashboard/nothing.html')