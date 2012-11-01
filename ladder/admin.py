from django.contrib import admin
from ladder.models import *

class CargoAdmin(admin.ModelAdmin):
	list_display = ('nombre','activo',)
	search_fields = ('nombre','descripcion',)
	ordering = ('nombre',)
	filter_horizontal = ('requisitos','siguientes','cargo_clave')
	raw_id_fields = ('rango','zona','anios_experiencia',)
	list_filter = ('departamento','cargo_critico','activo','anios_experiencia',)
	
class RequisitoAdmin(admin.ModelAdmin):
	list_display = ('nombre',)
	search_fields = ('nombre','descripcion',)
	ordering = ('nombre',)
	list_filter = ('categoria',)

admin.site.register(Cargo,CargoAdmin)
admin.site.register(Zona)
admin.site.register(Clasificacion)
admin.site.register(Requisito,RequisitoAdmin)
admin.site.register(AniosExperiencia)
admin.site.register(Departamento)
admin.site.register(Categoria)
