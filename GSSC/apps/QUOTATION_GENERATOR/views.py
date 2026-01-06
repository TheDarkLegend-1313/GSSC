from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required(login_url='login')
def quotation_generator_view(request):
    # Placeholder for processing click events
    return render(request, 'quotation_generator.html')