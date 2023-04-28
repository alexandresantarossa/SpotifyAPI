from django.http import HttpResponse

# Create your views here.

def index(request):
    return HttpResponse("Olá mundo! Este é o app notes de Tecnologias Web do Insper.")
