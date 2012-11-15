from django.http import Http404, HttpResponse
from django.shortcuts import render_to_response

# Create your views here.

def home(request):
	return render_to_response('ladder/index.html',locals())
