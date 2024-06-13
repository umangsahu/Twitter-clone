"""twitter URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from os import name
from django.contrib import admin
from django.urls import path

from login.views import login_page, signup_page, login_view, signup_view, find_users, logout_view, get_user_details
from posts.views import get_post, user_posts, delete_post, get_posts_of_following, get_child_post
# from createpost.views import create_post
from newpost.views import create_post_in_db, like_post, like_count,create_child_post
from frontendAdmin.views import home_page, profile_page
from friendsSetup.views import send_follow_request, accept_follow_request, reject_follow_request, get_pending_request


urlpatterns = [
    path('admin/', admin.site.urls),
    # custom url
    # custom ulr for making api response

    path('login-api', login_view, name="login_view"),
    path('signup-api', signup_view, name="signup_view"),
    path('api/create-post', create_post_in_db, name="create_post_in_db"),
    path('user-posts', user_posts, name='user_posts'),
    path('api/get-post/<int:post_id>', get_post, name="get_post"),
    path('api/delete-post/<int:post_id>/', delete_post, name='delete_post'),
    path('api/find-users', find_users, name="find_users"),
    path('api/send-follow-request/<int:user_id>/', send_follow_request, name='send_follow_request'),
    path('api/accept-follow-request/<int:relationship_id>', accept_follow_request, name='accept_follow_request'),
    path('api/reject-follow-request/<int:relationship_id>', reject_follow_request, name='reject_follow_request'),
    path('api/get-pending-request', get_pending_request, name="get_pending_request"),
    path('api/get-user/<int:user_id>', get_user_details, name='get_user_details'),
    path('api/get-post-of-friends', get_posts_of_following, name="get_post_of_friends"),
    path('api/logout', logout_view, name='logout'),
    path('api/like-post/<int:post_id>', like_post, name='like_post'),
    path('api/like-count/<int:post_id>', like_count, name="like_count"),
    path('api/get-child-post/<int:parent_post_id>/', get_child_post, name='get_child_post'),
    path('api/create-child-post/<int:parent_post_id>', create_child_post, name='create_child_post'),


    # custom url for htmml pages
    path('', home_page, name="home_page"),
    path('login', login_page, name="login_page"),
    path('signup', signup_page, name="signup_page"),
    # path('create-post', create_post, name="create_post"),
    path('profile-page', profile_page, name="profile_page"),




]
