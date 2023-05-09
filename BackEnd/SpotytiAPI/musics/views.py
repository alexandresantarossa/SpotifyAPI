from django.http import Http404
from django.shortcuts import render, redirect
from .models import Music
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import MusicSerializer

@api_view(['GET', 'POST', 'DELETE'])
def api_musics(request, music_id):
    try:
        music = Music.objects.get(id=music_id)
    except Music.DoesNotExist:
        raise Http404()
    
    if request.method == 'POST':
        new_music_data = request.data
        music.title = new_music_data['title']
        music.artist = new_music_data['artist']
        music.save()
    elif request.method == 'DELETE':
        music.delete()
        return Response(status=204)

    serialized_note = MusicSerializer(music)
    return Response(serialized_note.data)

@api_view(['GET', 'POST'])
def api_music(request):
    if request.method == 'POST':
        new_music_data = request.data 
        music = Music()
        music.title = new_music_data['title']
        music.artist = new_music_data['artist']
        music.save()

    all_notes = Music.objects.all()
    serialized_note = MusicSerializer(all_notes, many=True)
    return Response(serialized_note.data)
