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
from venv import create
from django.contrib import admin
from django.urls import path

from login.views import login_page, signup_page, login_view, signup_view
from posts.views import get_post, user_posts, delete_post
from createpost.views import create_post
from newpost.views import create_post_in_db
from frontendAdmin.views import home_page




urlpatterns = [
    path('admin/', admin.site.urls),
    # custom url
    # custom ulr for making api response

    path('login-api', login_view, name="login_view"),
    path('signup-api', signup_view, name="signup_view"),
    path('create-post-api', create_post_in_db, name="create_post_in_db"),
    path('user-posts', user_posts, name='user_posts'),
    path('get-post/<int:post_id>/',get_post,name="get_post"),
    path('delete-post/<int:post_id>/', delete_post, name='delete_post'),

    # custom url for htmml pages
    path('', home_page, name="home_page"),
    path('login', login_page, name="login_page"),
    path('signup', signup_page, name="signup_page"),
    path('create-post', create_post, name="create_post"),
    


]
