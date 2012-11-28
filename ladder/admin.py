from django.contrib import admin
from ladder.models import *

class CargoAdmin(admin.ModelAdmin):
	list_display = ('nombre','activo',)
	search_fields = ('nombre','descripcion',)
	ordering = ('nombre',)
	filter_horizontal = ('requisitos','siguientes','cargo_clave')
	raw_id_fields = ('rango','zona','anios_experiencia','avatar_hombre','avatar_mujer')
	list_filter = ('departamento','cargo_critico','activo','anios_experiencia',)
	
class RequisitoAdmin(admin.ModelAdmin):
	list_display = ('nombre',)
	search_fields = ('nombre','descripcion',)
	ordering = ('nombre',)
	list_filter = ('categoria',)
	
class AvatarAdmin(admin.ModelAdmin):
	raw_id_fields = ('cuerpo','cara','pelo','camisa','pantalon','zapatos','accesorios','sombrero',)
	
class JugadorAdmin(admin.ModelAdmin):
	list_display = ('nombre','correo',)
	search_fields = ('nombre','correo',)
	ordering = ('correo',)
	list_filter = ('sexo',)

admin.site.register(Cargo,CargoAdmin)
admin.site.register(Zona)
admin.site.register(Clasificacion)
admin.site.register(Requisito,RequisitoAdmin)
admin.site.register(AniosExperiencia)
admin.site.register(Departamento)
admin.site.register(Categoria)
admin.site.register(CuerpoAvatar)
admin.site.register(CamisaAvatar)
admin.site.register(PantalonAvatar)
admin.site.register(PeloAvatar)
admin.site.register(ZapatosAvatar)
admin.site.register(CaraAvatar)
admin.site.register(AccesoriosAvatar)
admin.site.register(SombreroAvatar)
admin.site.register(Avatar, AvatarAdmin)
admin.site.register(Paso)
admin.site.register(Ruta)
admin.site.register(Jugador, JugadorAdmin)
