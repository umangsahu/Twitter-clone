from django.shortcuts import render

# Create your views here.

def home_page(request):
    return render(request,'./home.html')

def profile_page(request):
    return render(request,'./profile.html')