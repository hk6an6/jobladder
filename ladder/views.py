from django.http import Http404, HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.core import serializers
from models import Cargo, Zona, Requisito, Avatar
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
	result = serializers.serialize('json', data)
	return HttpResponse(result, mimetype='application/json; charset=utf-8')
	
def simulate(request, origin_pk, target_pk, sex):
	logger.debug('Origin cargo: ' + origin_pk + '. Target cargo: ' + target_pk + '. Sex: ' + sex)
	origin_cargo = Cargo.objects.all().filter(pk=int(origin_pk))
	target_cargo = Cargo.objects.all().filter(pk=int(target_pk))
	origin_avatar = None
	target_avatar = None
	if sex == 'H':
		origin_avatar=Avatar.objects.all().filter(cargos_hombre__pk=origin_pk, cargos_hombre__avatar_hombre__pk=F('pk'))
		target_avatar=Avatar.objects.all().filter(cargos_hombre__pk=target_pk, cargos_hombre__avatar_hombre__pk=F('pk'))
	else:
		origin_avatar=Avatar.objects.all().filter(cargos_mujer__pk=origin_pk, cargos_mujer__avatar_mujer__pk=F('pk'))
		origin_avatar=Avatar.objects.all().filter(cargos_mujer__pk=target_pk, cargos_mujer__avatar_mujer__pk=F('pk'))
	origin_cargo_json = serializers.serialize('json', origin_cargo)
	target_cargo_json = serializers.serialize('json', target_cargo)
	origin_avatar_json = serializers.serialize('json', origin_avatar)
	target_avatar_json = serializers.serialize('json', target_avatar)
	return render_to_response('ladder/simulation.html', locals(), RequestContext(request))

def zona_by_pk(request, zona_pk):
    data = Zona.objects.all().filter(pk = int(zona_pk))
    result = serializers.serialize('json', data)
    return HttpResponse(result, mimetype='application/json; charset=utf-8')

def requisito_by_pk(request, requisito_pk):
    data = Requisito.objects.all().filter(pk = int(requisito_pk))
    result = serializers.serialize('json', data)
    return HttpResponse(result, mimetype='application/json; charset=utf-8')

def avatar_by_pk(request, avatar_pk):
    data = Avatar.objects.all().filter(pk = int(avatar_pk))
    result = serializers.serialize('json', data)
    return HttpResponse(result, mimetype='application/json; charset=utf-8')

