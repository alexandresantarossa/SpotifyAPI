from django.http import  Http404
from django.shortcuts import render, redirect
from .models import Music
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import MusicSerializer


@api_view(['GET', 'POST', 'DELETE'])
def api_musics(request, Music_id):
    try:
        note = Music.objects.get(id=Music_id)
    except Music.DoesNotExist:
        raise Http404()
    
    if request.method == 'POST':
        new_note_data = request.data
        note.title = new_note_data['title']
        note.content = new_note_data['content']
        note.save()
    elif request.method == 'DELETE':
        note.delete()
        return Response(status=204)

    serialized_note = MusicSerializer(note)
    return Response(serialized_note.data)

@api_view(['GET', 'POST'])
def api_music(request):
    if request.method == 'POST':
        new_note_data = request.data 
        note = Music()
        note.title = new_note_data['title']
        note.content = new_note_data['content']
        note.save()

    all_notes = Music.objects.all()
    serialized_note = MusicSerializer(all_notes, many=True)
    return Response(serialized_note.data)