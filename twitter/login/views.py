# views.py
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth.hashers import make_password, check_password
from .models import UserData
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
import json
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from friendsSetup.models import Relationship
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
import base64
from django.core.files.base import ContentFile


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
        # Redirect to home or desired page
        return JsonResponse({'success': True, 'redirect_url': '/'})

    return JsonResponse({'success': False, 'error': 'Invalid request'})


def logout_view(request):
    if request.method == 'GET':

        logout(request)

        return JsonResponse({'status': 'LOGOUT', 'message': 'User logged out successfully'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


def find_users(request):
    if request.method == 'GET':
        query = request.GET.get('q', '').strip()
        if len(query) > 0:
            users = UserData.objects.filter(
                Q(first_name__istartswith=query) | Q(
                    last_name__istartswith=query)
            )
            # Serialize the queryset to JSON
            user_data = [{'id': user.id, 'first_name': user.first_name,
                'last_name': user.last_name} for user in users]
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


@login_required
def get_profile(request):

    User = get_user_model()
    user = request.user

    # Get followers
    followers = Relationship.objects.filter(
        following=user, status=Relationship.ACCEPTED).values_list('follower', flat=True)
    followers = User.objects.filter(id__in=followers).values(
        'id', 'first_name', 'last_name', 'email')

    # Get following
    following = Relationship.objects.filter(
        follower=user, status=Relationship.ACCEPTED).values_list('following', flat=True)
    following = User.objects.filter(id__in=following).values(
        'id', 'first_name', 'last_name', 'email')

    user_data = {
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'image': user.profile_image.url if user.profile_image else None,
        'bio':user.bio,
        'followers': len(list(followers)),
        'following': len(list(following)),
    }
    return JsonResponse({'status': 'ok', 'user': user_data})


@login_required
@require_http_methods(["PUT"])
def update_profile(request):
    
        user = request.user
        data = json.loads(request.body)

        first_name = data.get('first_name')
        # last_name = data.get('last_name')
        bio = data.get('bio')
        image_data = data.get('image')

        if first_name:
            user.first_name = first_name
        # # if last_name:
        # #     user.last_name = last_name
        if bio:
            user.bio = bio
        
        if image_data:
            user.profile_image = image_data
            
        print(user.bio,user.first_name)

        if image_data:
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]
            image = ContentFile(base64.b64decode(imgstr), name=f'{user.id}.{ext}')
            user.profile_image.save(image.name, image)

        user.save()
            
        response_data = {
            'id': user.id,
            'first_name': user.first_name,
            # 'last_name': user.last_name,
            'email': user.email,
            'bio': user.bio,
            'profile_image_url': user.profile_image.url if user.profile_image else None,
        }
        return JsonResponse({'status': 'ok', 'user': response_data}, status=200)


# for html pages
def login_page(request):
    return render(request,'login.html')

def signup_page(request):
    return render(request,'signup.html')
