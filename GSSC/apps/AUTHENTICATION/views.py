# from django.shortcuts import render
# from django.contrib.auth import authenticate, login, logout
# from django.shortcuts import redirect
# from django.contrib import messages
# from django.contrib.auth.models import User

# def login_view(request):
#     if request.method == "POST":
#         username = request.POST['username']
#         password = request.POST['password']

#         user = authenticate(request, username=username, password=password)

#         if user is not None:
#             login(request, user)
#             return redirect('dashboard_url')
#         else:
#             messages.error(request, "Invalid username or password")

#     return render(request, 'login.html')

# def register_view(request):
#     if request.method == "POST":
#         username = request.POST['username']
#         email = request.POST['email']
#         password = request.POST['password']
#         confirm = request.POST['confirm_password']

#         if password != confirm:
#             messages.error(request, "Passwords do not match")
#             return redirect('register')

#         if User.objects.filter(username=username).exists():
#             messages.error(request, "Username already exists")
#             return redirect('register')

#         user = User.objects.create_user(
#             username=username,
#             email=email,
#             password=password
#         )
#         user.save()

#         messages.success(request, "Account created successfully")
#         return redirect('login')

#     return render(request, 'register.html')

# def logout_view(request):
#     logout(request)
#     return redirect('login')

# views.py (Complete file)
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib import messages

def home(request):
    return render(request, 'home.html')

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Log the user in immediately after registering
            login(request, user)
            messages.success(request, "Registration successful.")
            return redirect('home')
        else:
            messages.error(request, "Unsuccessful registration. Invalid information.")
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})