from django.http import JsonResponse, HttpResponseNotFound
from django.contrib.auth.decorators import login_required
from newpost.models import NewPost
from django.shortcuts import get_object_or_404, render
from django.db.models import Q
from newpost.models import NewPost
from django.contrib.auth import get_user_model
from friendsSetup.models import Relationship
from django.views.decorators.csrf import csrf_exempt
import json


# Create your views here.
# request
@login_required
def user_posts(request):
    user = request.user
    posts = NewPost.objects.filter(user=user).order_by('-created_at')

    # Get the profile image URL
    profile_image_url = user.profile_image.url if user.profile_image else None

    # Prepare the list to hold serialized post data
    posts_data = []
    for post in posts:
        post_data = {
            'post_id': post.id,
            'username': f"{user.first_name} {user.last_name}",
            'content': post.content,
            'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'likes_count': post.likes.count(),
            'profile_image_url': profile_image_url,  # Include profile image URL
            # Add other fields as needed
        }
        posts_data.append(post_data)

    return JsonResponse({'status': 'ok', 'posts': posts_data})

@login_required
def delete_post(request, post_id):
    if request.method in ['POST', 'DELETE']:
        try:
            post = get_object_or_404(NewPost, id=post_id, user=request.user)
            post.delete()
            return JsonResponse({'success': True, 'message': "Post deleted successfully"})
        except NewPost.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Post not found.'})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method.'})


@login_required
@csrf_exempt
def edit_post(request, post_id):
    if request.method in ['POST', 'PUT']:
        try:
            data = json.loads(request.body)
            content = data.get("content", "")

            if not content:
                return JsonResponse({'success': False, 'error': 'Content cannot be empty.'})

            post = get_object_or_404(NewPost, id=post_id, user=request.user)
            post.content = content
            post.save()

            return JsonResponse({'success': True, 'message': "Post updated successfully"})
        except NewPost.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Post not found.'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON.'})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method.'})


def get_post(request, post_id):
    post = get_object_or_404(NewPost, id=post_id)
    
    # Get the profile image URL of the user who posted the post
    profile_image_url = post.user.profile_image.url if post.user.profile_image else None
    
    post_data = {
        'post_id': post.id,
        'username': f"{post.user.first_name} {post.user.last_name}",
        'content': post.content,
        'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'profile_image_url': profile_image_url,  # Include profile image URL
        # 'likes': post.likes,
    }
    
    return JsonResponse({'status': 'ok', 'post': post_data})


@login_required
def get_posts_of_following(request):
    user = request.user
    UserModel = get_user_model()

    # Get the list of users the logged-in user is following
    following_ids = Relationship.objects.filter(
        follower=user,
        status=Relationship.ACCEPTED
    ).values_list('following_id', flat=True)

    # Include the logged-in user's own ID to include their posts as well
    following_ids = list(following_ids) + [user.id]

    # Get the posts made by the logged-in user and users they are following, ordered by created_at in reverse
    posts = NewPost.objects.filter(
        user__in=following_ids, is_child_post=False
    ).order_by('-created_at')

    # Prepare the response data including user's profile image
    posts_data = []
    for post in posts:

        post_user = post.user
        post_data = {
            'id': post.id,
            'user_id': post_user.id,
            'user_first_name': post_user.first_name,
            'user_last_name': post_user.last_name,
            'content': post.content,
            'created_at': post.created_at,
        }
        # Add user profile image URL if available
        if post_user.profile_image:
            post_data['user_profile_image_url'] = request.build_absolute_uri(
                post_user.profile_image.url)
        else:
            post_data['user_profile_image_url'] = None

        posts_data.append(post_data)

    return JsonResponse({'status': 'ok', 'posts': posts_data})


@login_required
@csrf_exempt
def get_child_post(request, parent_post_id):
    parent_post = get_object_or_404(NewPost, id=parent_post_id)

    # Filter child posts where is_child_post is True
    child_posts = NewPost.objects.filter(
        parent_post=parent_post, is_child_post=True).order_by('-created_at')

    # Prepare the response data
    child_posts_data = [
        {
            'post_id': post.id,
            'username': f"{post.user.first_name} {post.user.last_name}",
            'content': post.content,
            'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'likes': post.likes.count(),  # Get the count of likes
            'profile_image_url': post.user.profile_image.url if post.user.profile_image else None  # Include profile image URL
        } for post in child_posts
    ]

    return JsonResponse({'status': 'ok', 'child_posts': child_posts_data})



# pages
# def home_page(request):
#     return render(request,'./feed.html')
