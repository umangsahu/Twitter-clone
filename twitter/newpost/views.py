from calendar import c
from operator import pos
from django.http import JsonResponse
from django.shortcuts import render

from login.models import UserData
from .models import NewPost
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required  # type: ignore

# Create your views here.
@login_required
@csrf_exempt
def create_post_in_db(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            content = data.get('post')
            user = request.user
            if not content:
                return JsonResponse({'success': False, 'error': 'Content cannot be empty'}, status=400)

            # Ensure we are using the UserData instance
            user_data = UserData.objects.get(pk=user.pk)
            # post = Post.objects.create(user=, content=content)
            new_post = NewPost.objects.create(user=user_data, content=content)
            return JsonResponse({'success': True, 'message': 'Post created successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

