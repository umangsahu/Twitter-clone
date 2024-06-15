from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Relationship

from django.shortcuts import get_object_or_404

from django.conf import settings
from django.contrib.auth import get_user_model


@login_required
def send_follow_request(request, user_id):
    User = get_user_model()
    user_to_follow = get_object_or_404(User, id=user_id)
    if( user_to_follow == request.user):
        return JsonResponse({'status': 'ok', 'message': 'User does not send request to self'})
    if request.method == 'POST' :
        relationship = Relationship.objects.get_or_create(
            follower=request.user,
            following=user_to_follow,
            defaults={'status': Relationship.PENDING}
        )
        # relationship.save()
        return JsonResponse({'status': 'ok', 'message': 'Follow request sent.'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=400)


@login_required
def accept_follow_request(request, relationship_id):
    if request.method == 'POST':
        relationship = get_object_or_404(Relationship, id=relationship_id)
        if relationship.following == request.user and relationship.status == Relationship.PENDING:
            relationship.status = Relationship.ACCEPTED
            relationship.save()
            return JsonResponse({'status': 'ok', 'message': 'Follow request accepted.'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=400)


@login_required
def reject_follow_request(request, relationship_id):
    if request.method == 'POST':
        relationship = get_object_or_404(Relationship, id=relationship_id)
        if relationship.following == request.user and relationship.status == Relationship.PENDING:
            relationship.status = Relationship.REJECTED
            relationship.save()
            return JsonResponse({'status': 'ok', 'message': 'Follow request rejected.'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=400)


@login_required
def get_pending_request(request):
    user = request.user
    pending_requests = Relationship.objects.filter(following=user, status=Relationship.PENDING)
    
    pending_requests_data = [
        {
            'id': rel.id,
            'follower_id': rel.follower.id,
            'created_at': rel.created_at
        } for rel in pending_requests
    ]
    
    return JsonResponse({'status': 'ok', 'pending_requests': pending_requests_data})




    # Get following
    # following = Relationship.objects.filter(follower=user, status=Relationship.ACCEPTED).values_list('following', flat=True)
    # following = User.objects.filter(id__in=following).values('id', 'first_name', 'last_name', 'email')
    
@login_required
def get_follower(request):
    User = get_user_model()
    user = request.user

    # Get followers
    follower_ids = Relationship.objects.filter(following=user, status=Relationship.ACCEPTED).values_list('follower', flat=True)
    followers = User.objects.filter(id__in=follower_ids).values('id', 'first_name', 'last_name', 'email','profile_image','bio')

    # Convert the followers queryset to a list
    followers_list = list(followers)

    # Return the JSON response with followers data
    return JsonResponse({'status': 'ok', 'followers': followers_list})


@login_required
def get_following(request):
    User = get_user_model()
    user = request.user

    # # Get followers
    # follower_ids = Relationship.objects.filter(following=user, status=Relationship.ACCEPTED).values_list('follower', flat=True)
    # followers = User.objects.filter(id__in=follower_ids).values('id', 'first_name', 'last_name', 'email', 'created_at')
    # followers_list = list(followers)

    # Get following
    following_ids = Relationship.objects.filter(follower=user, status=Relationship.ACCEPTED).values_list('following', flat=True)
    following = User.objects.filter(id__in=following_ids).values('id', 'first_name', 'last_name', 'email','profile_image','bio')
    following_list = list(following)

    # Return the JSON response with both followers and following data
    return JsonResponse({'status': 'ok', 'following': following_list})