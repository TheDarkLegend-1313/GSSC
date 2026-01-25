from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from .models import Product
from .services import update_prices


def price_tracker_view(request):
    """Main view for displaying price tracker page"""
    selected_type = request.GET.get('type', '')
    
    # Filter products based on category
    products = Product.objects.all()
    
    if selected_type:
        if selected_type in ['solar_panel', 'inverter', 'battery']:
            products = products.filter(category=selected_type)
    
    context = {
        'products': products,
        'selected_type': selected_type,
    }
    
    return render(request, 'price_tracker.html', context)


@require_http_methods(["GET", "POST"])
def update_prices_view(request):
    """View for updating prices by scraping websites"""
    if request.method == 'POST':
        category = request.POST.get('category', None)
        
        try:
            # Update prices
            count = update_prices(category=category)
            
            messages.success(request, f'Successfully updated {count} products!')
            return redirect('update_success_url')
            
        except Exception as e:
            messages.error(request, f'Error updating prices: {str(e)}')
            return redirect('price_tracker_url')
    
    # GET request - show update form or redirect
    category = request.GET.get('category', None)
    
    try:
        count = update_prices(category=category)
        return redirect('update_success_url')
    except Exception as e:
        messages.error(request, f'Error updating prices: {str(e)}')
        return redirect('price_tracker_url')


def update_success_view(request):
    """View for showing success message after price update"""
    return render(request, 'update_success.html')
