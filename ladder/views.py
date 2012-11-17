from django.http import Http404, HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core import serializers
from models import Cargo
import logging

# Create your views here.

logger = logging.getLogger('console')

def home(request):
	return render_to_response('ladder/index.html',locals(),RequestContext(request))

def cargo(request,cargo_name_fragment=None):
	if cargo_name_fragment:
		logger.debug(cargo_name_fragment)
		return HttpResponse(serializers.serialize('json',Cargo.objects.filter(nombre__icontains=cargo_name_fragment))[:20], mimetype='application/json')
	else:
		logger.debug('output everything')
		return HttpResponse(serializers.serialize('json',Cargo.objects.all()), mimetype='application/json')
		