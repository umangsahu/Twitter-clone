# views.py
from django.shortcuts import render, get_object_or_404,redirect
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from .models import UserData
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
import json



# Create your views here.
# for handle request


def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data['username']
            password = data['password']
            
            user = authenticate(username=username, password=password)
        
            if user is not None:
                login(request, user)
                return JsonResponse({'status': 'success', 'message': 'Login successful'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid data'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)




def signup_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        first_name = data['first_name']
        last_name = data['last_name']
        gender = data['gender']
        country_code = data['country_code']
        mobile_no = data['mobile_no']
        email = data['email']
        password = data['password']
        password_confirm = data['password_confirm']
        
        if password != password_confirm:
            return JsonResponse({'success': False, 'error': 'Passwords do not match'})

        if UserData.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'error': 'Email already exists'})

        hashed_password = make_password(password)
        user_data = UserData.objects.create(
            first_name=first_name,
            last_name=last_name,
            gender=gender,
            country_code=country_code,
            mobile_no=mobile_no,
            email=email,
            password=hashed_password
        )
        user_data.save()
        return JsonResponse({'success': True, 'redirect_url': '/'})  # Redirect to home or desired page

    return JsonResponse({'success': False, 'error': 'Invalid request'})

def logout_view(request):
    logout(request)
    redirect('login_page')
    return JsonResponse({'success': True, 'redirect_url': '/login'}) 

def find_users(request):
    if request.method == 'GET':
        query = request.GET.get('q', '').strip() 
        if len(query) >0:  
            users = UserData.objects.filter(
                Q(first_name__istartswith=query) | Q(last_name__istartswith=query)
            )
            # Serialize the queryset to JSON
            user_data = [{'id': user.id, 'first_name': user.first_name, 'last_name': user.last_name} for user in users]
            return JsonResponse({'users': user_data})
        else:
            return JsonResponse({'error': 'Please enter a single letter query'})
    
# @login_required
def get_user_details(request, user_id):
    UserModel = get_user_model()
    try:
        user = get_object_or_404(UserModel, id=user_id)
    except UserModel.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
    
    user_data = {
        'id': user.id,
        # 'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    }
    
    return JsonResponse({'status': 'ok', 'user': user_data})

# for html pages
def login_page(request):
    return render(request,'login.html')

def signup_page(request):
    return render(request,'signup.html')
