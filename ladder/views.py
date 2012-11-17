from django.http import Http404, HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core import serializers
from models import Cargo

# Create your views here.

def home(request):
	return render_to_response('ladder/index.html',locals(),RequestContext(request))

def cargo(request):
	return HttpResponse(serializers.serialize('json',Cargo.objects.all()), mimetype='application/json')