from django.http import JsonResponse, HttpResponseNotFound
from django.contrib.auth.decorators import login_required
from newpost.models import NewPost
from django.shortcuts import get_object_or_404, render


# Create your views here.
# request

@login_required
def user_posts(request):

    user = request.user
    posts = NewPost.objects.filter(user=user).order_by('-created_at')
    
    posts_data = [
        {'post_id': post.id,
         'username': f"{post.user.first_name} {post.user.last_name}",
         'content': post.content,
         'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S'),
         'likes': post.likes,
         'is_child_post': post.is_child_post,
         } for post in posts
    ]
    return JsonResponse(posts_data, safe=False)


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


def get_post(request, post_id):
    try:
        post = NewPost.objects.get(id=post_id, user=request.user)
        post_data = {
            'id': post.id,
            'content': post.content,
            'created_at': post.created_at,
            'user': post.user.username,
        }
        return JsonResponse(post_data)
    except:
        return HttpResponseNotFound('Post not found')

# pages
# def home_page(request):
#     return render(request,'./feed.html')
