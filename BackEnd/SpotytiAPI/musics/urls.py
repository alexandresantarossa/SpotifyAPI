from django.urls import path

from . import views

urlpatterns = [
    path('api/musics/', views.api_music),
    path('api/musics/<int:Music_id>/', views.api_musics),
]