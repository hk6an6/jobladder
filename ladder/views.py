from django.http import Http404, HttpResponse
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.template import RequestContext
from django.core import serializers
from models import *
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
	
def create_avatar(request, origin_pk, target_pk, sex):
	cuerpos = None
	facciones = CaraAvatar.objects.all()
	cejas = Faccion.objects.filter(etiqueta__icontains="cejas")
	ojos = Faccion.objects.filter(etiqueta__icontains="ojos")
	pantalones = None
	camisas = None
	zapatos = None
	pelos = None
	cascos = None
	accesorios = AccesoriosAvatar.objects.all()
	cabellos = PeloAvatar.objects.all()
	cabellos_experiencia = CabelloAvatar.objects.all()
	sombreros = SombreroAvatar.objects.all()
	if(sex == 'H'):
		cuerpos = CuerpoAvatar.objects.filter(etiqueta__icontains="hombre")
		pantalones = PantalonAvatar.objects.filter(etiqueta__icontains="hombre")
		camisas = CamisaAvatar.objects.filter(etiqueta__icontains="hombre")
		zapatos = ZapatosAvatar.objects.filter(etiqueta__icontains="hombre")
		pelos = PeloAvatar.objects.filter(etiqueta__icontains="hombre")
		cascos = SombreroAvatar.objects.filter(etiqueta__icontains="hombre")
	else:
		cuerpos = CuerpoAvatar.objects.filter(etiqueta__icontains="mujer")
		pantalones = PantalonAvatar.objects.filter(etiqueta__icontains="mujer")
		camisas = CamisaAvatar.objects.filter(etiqueta__icontains="mujer")
		zapatos = ZapatosAvatar.objects.filter(etiqueta__icontains="mujer")
		pelos = PeloAvatar.objects.filter(etiqueta__icontains="mujer")
		cascos = SombreroAvatar.objects.filter(etiqueta__icontains="mujer")
	cuerpos = cuerpos.order_by('etiqueta','contextura')
	pantalones = pantalones.order_by('etiqueta','contextura')
	camisas = camisas.order_by('etiqueta','contextura')
	pelos = pelos.order_by('etiqueta')
	return render_to_response('ladder/create_avatar.html', locals(), RequestContext(request))

def next_step(request, origin_pk, target_pk, sex):
	
	return render_to_response('ladder/next_step.html', locals(), RequestContext(request))

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
	origin_cargo = origin_cargo[0]
	target_cargo = target_cargo[0]
	origin_avatar = origin_avatar[0];
	target_avatar = target_avatar[0];
	logger.debug(origin_avatar.cuerpo.imagen.url)
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

def avatar_cuerpo_by_pk(request, cuerpo_pk):
	item = get_object_or_404(CuerpoAvatar, pk=int(cuerpo_pk))
	return redirect(item.imagen.url)

def avatar_camisa_by_pk(request, camisa_pk):
	item = get_object_or_404(CamisaAvatar, pk=int(camisa_pk))
	return redirect(item.imagen.url)
	
def	avatar_pantalon_by_pk(request, pantalon_pk):
	item = get_object_or_404(PantalonAvatar, pk=int(pantalon_pk))
	return redirect(item.imagen.url)
	
def avatar_cabello_by_pk(request, cabello_pk):
	item = get_object_or_404(CabelloAvatar, pk=int(cabello_pk))
	return redirect(item.imagen.url)
	
def avatar_pelo_by_pk(request, pelo_pk):
	item = get_object_or_404(PeloAvatar, pk=int(pelo_pk))
	return redirect(item.imagen.url)

def avatar_faccion_by_pk(request, faccion_pk):
	item = get_object_or_404(Faccion, pk=int(faccion_pk))
	return redirect(item.imagen.url)

def avatar_zapatos_by_pk(request, zapatos_pk):
	item = get_object_or_404(ZapatosAvatar, pk=int(zapatos_pk))
	return redirect(item.imagen.url)
	
def	avatar_cara_by_pk(request, cara_pk):
	item = get_object_or_404(CaraAvatar, pk=int(cara_pk))
	return redirect(item.imagen.url)
	
def avatar_accesorios_by_pk(request, accesorios_pk):
	item = get_object_or_404(AccesoriosAvatar, pk=int(accesorios_pk))
	return redirect(item.imagen.url)
	
def avatar_sombrero_by_pk(request, sombrero_pk):
	item = get_object_or_404(SombreroAvatar, pk=int(sombrero_pk))
	return redirect(item.imagen.url)

def avatar_departamento_by_pk(request, departamento_pk):
	item = get_object_or_404(Departamento, pk=int(departamento_pk))
	return redirect(item.fondo.url)
