from django.db import models
#completar opciones
OPCIONES_ANIOS_EXPERIENCIA = (
	(1,'0 - 2'),
	(2,'2 - 4'),
)

class Requisito(models.Model):
	nombre = models.CharField(max_length=256)
	descripcion = models.CharField(max_length=512)
	def __unicode__(self):
		return self.nombre
	

#completar configuracion de campos. Poner nombres descriptivos a los campos
class Cargo(models.Model):
	nombre = models.CharField(max_length=256)
	descripcion = models.CharField(max_length=1024)
	anios_experiencia = models.IntegerField(choices=OPCIONES_ANIOS_EXPERIENCIA)
	nivel_jerarquia = models.IntegerField(null=True, blank=True)
	rango = models.IntegerField(null=True, blank=True)
	otros_requisitos = models.CharField(max_length=512)
	activo = models.BooleanField(default=True)
	requisitos = models.ManyToManyField(Requisito, blank=True)
	siguientes = models.ManyToManyField('self',symmetrical=False, blank=True)
	def __unicode__(self):
		return self.nombre


class Zona(models.Model):
	nombre = models.CharField(max_length=256)
	def __unicode__(self):
		return self.nombre

	
class Clasificacion(models.Model):
	nombre = models.CharField(max_length=256)
	def __unicode__(self):
		return self.nombre
	
