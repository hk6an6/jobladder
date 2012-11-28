from django.http import Http404, HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.core import serializers
from models import Cargo
from django.db.models import F
import logging

# Create your views here.
# see https://docs.djangoproject.com/en/dev/topics/db/queries/

#create a logger that can output content to console. This will be used while in development
logger = logging.getLogger('console')

#output home page
def home(request):
	return render_to_response('ladder/index.html',locals(),RequestContext(request))

#output a json collection holding all known cargos in the database
def cargo(request,cargo_name_fragment=None):
	if cargo_name_fragment:
		logger.debug(cargo_name_fragment)
		return HttpResponse(serializers.serialize('json',Cargo.objects.filter(nombre__icontains=cargo_name_fragment, activo=True), fields=('pk','nombre',)), mimetype='application/json; charset=utf-8')
	else:
		logger.debug('output everything')
		return HttpResponse(serializers.serialize('json',Cargo.objects.all().filter(activo=True), fields=('pk','nombre',)), mimetype='application/json; charset=utf-8')
		
def cargo_destino(request, cargo_origen=None):
	logger.debug(cargo_origen)
	if cargo_origen:
		results = get_object_or_404(Cargo, pk=int(cargo_origen)).cargo_clave_set.all();
		return HttpResponse(serializers.serialize('json',results, fields=('pk','nombre',)) , mimetype='application/json; charset=utf-8')
	else:
		raise Http404

def cargo_by_pk(request, cargo_pk=0):
	data = Cargo.objects.all().filter(pk = int(cargo_pk))
	result = None
	for o in data:
		result = serializers.serialize('json', data, fields=('pk','nombre','siguientes','requisitos','cargo_critico','avatar_hombre','avatar_mujer','zona','anios_experiencia','tiempo_permanencia'))
	return HttpResponse(result, mimetype='application/json; charset=utf-8')
	
def simulate(request, origin, target, sex):
	logger.debug('Origin cargo: ' + origin + '. Target cargo: ' + target + '. Sex: ' + sex)
	return render_to_response('ladder/simulation.html', locals(), RequestContext(request))
