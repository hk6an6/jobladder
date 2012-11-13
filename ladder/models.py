# coding=utf-8
from django.db import models
#completar opciones
OPCIONES_ANIOS_EXPERIENCIA = (
	(1,'0 - 2'),
	(2,'2 - 4'),
	(3,'4 - 6'),
	(4,'6 - 8'),
	(5,'8 - 10'),
	(6,'10 - 12'),
	(7,'12 - 14'),
	(8,'14 - 16'),
	(9,'1 - 2'),
	(10,'3 - 4'),
	(11,'3 - 6'),
	(12,'6 - 9'),
	(13,'8 - 12'),
	(14,'10 - 14'),
	(15,'12 - 16'),
	(16,'4 - 7'),
	(17,'15 - 19'),
	(18,'13 - 17'),
	(19,'11 - 14'),
	(20,'8 - 11'),
	(21,'9 - 13'),
	(22,'12 - 17'),
	(23,'15 - 21'),
	(24,'9 - 12'),
	(25,'5 - 7'),
	(26,'7 - 10'),
)
OPCIONES_NIVEL_JERARQUIA = (
	(1,'1'),
	(2,'2'),
	(3,'3'),
	(4,'4'),
	(5,'5'),
	(6,'6'),
	(7,'7'),
	(8,'8'),
	(9,'9'),
	(10,'10'),
	(11,'11'),
	(12,'12'),
	(13,'13'),
	(14,'14'),
	(15,'15'),
)

class Categoria(models.Model):
	nombre = models.CharField(max_length=256)
	#use the upload_to attribute con configure file upload through boto & django storages
	icono = models.ImageField(upload_to='storages.backends.s3boto', blank=True, null=True)
	def __unicode__(self):
		return self.nombre

class Requisito(models.Model):
	nombre = models.CharField(max_length=256)
	descripcion = models.CharField(max_length=512)
	categoria = models.ForeignKey(Categoria)
	def __unicode__(self):
		return self.nombre
	

class AniosExperiencia(models.Model):
	etiqueta = models.CharField(max_length=8)
	def __unicode__(self):
		return self.etiqueta

class Zona(models.Model):
	nombre = models.CharField(max_length=256)
	#use the upload_to attribute con configure file upload through boto & django storages
	fondo = models.ImageField(upload_to='storages.backends.s3boto', blank=True, null=True)
	def __unicode__(self):
		return self.nombre

	
class Clasificacion(models.Model):
	nombre = models.CharField(max_length=256)
	def __unicode__(self):
		return self.nombre

class Departamento(models.Model):
	nombre = models.CharField(max_length=256)
	def __unicode__(self):
		return self.nombre

#completar configuracion de campos. Poner nombres descriptivos a los campos
class Cargo(models.Model):
	nombre = models.CharField(max_length=256)
	descripcion = models.CharField(max_length=1024)
	#anios_experiencia = models.IntegerField(choices=OPCIONES_ANIOS_EXPERIENCIA)
	nivel_jerarquia = models.IntegerField(choices=OPCIONES_NIVEL_JERARQUIA)
	#otros_requisitos = models.CharField(max_length=512)
	activo = models.BooleanField(default=True)
	cargo_critico = models.BooleanField(default=False)
	departamento = models.ForeignKey(Departamento, verbose_name='Vicepresidencia')
	rango = models.ForeignKey(Clasificacion, verbose_name='Rango', blank=True, null=True)
	zona = models.ForeignKey(Zona, verbose_name='Ubicación geográfica', blank=True, null=True)
	anios_experiencia = models.ForeignKey(AniosExperiencia, verbose_name='años de experiencia')
	requisitos = models.ManyToManyField(Requisito, blank=True)
	cargo_clave = models.ManyToManyField('self',symmetrical=False,blank=True, related_name='cargo_clave_set')
	siguientes = models.ManyToManyField('self',symmetrical=False, blank=True, related_name='siguiente_set')
	def __unicode__(self):
		return self.nombre


class CuerpoAvatar(models.Model):
	#use the upload_to attribute con configure file upload through boto & django storages
	imagen = models.ImageField(upload_to='storages.backends.s3boto', blank=True, null=True)
	
class RopaAvatar(models.Model):
	#use the upload_to attribute con configure file upload through boto & django storages
	imagen = models.ImageField(upload_to='storages.backends.s3boto', blank=True, null=True)
	
class ZapatosAvatar(models.Model):
	#use the upload_to attribute con configure file upload through boto & django storages
	imagen = models.ImageField(upload_to='storages.backends.s3boto', blank=True, null=True)
	
class CaraAvatar(models.Model):
	#use the upload_to attribute con configure file upload through boto & django storages
	imagen = models.ImageField(upload_to='storages.backends.s3boto', blank=True, null=True)
	
class AccesoriosAvatar(models.Model):
	#use the upload_to attribute con configure file upload through boto & django storages
	imagen = models.ImageField(upload_to='storages.backends.s3boto', blank=True, null=True)
	
class SombreroAvatar(models.Model):
	#use the upload_to attribute con configure file upload through boto & django storages
	imagen = models.ImageField(upload_to='storages.backends.s3boto', blank=True, null=True)
	
class Avatar(models.Model):
	cuerpo = models.ForeignKey(CuerpoAvatar, verbose_name='Cuerpo')
	cara   = models.ForeignKey(CaraAvatar, verbose_name='Cara')
	ropa   = models.ForeignKey(RopaAvatar, verbose_name='Sombrero')
	zapatos= models.ForeignKey(ZapatosAvatar, verbose_name='Sombrero')
	accesorios= models.ForeignKey(AccesoriosAvatar, verbose_name='Sombrero', blank=True, null=True)
	sombrero = models.ForeignKey(SombreroAvatar, verbose_name='Sombrero', blank=True, null=True)
	
class Paso(models.Model):
	numero = models.IntegerField()
	anios_ejercidos = models.IntegerField()
	cargo = models.ForeignKey(Cargo)
	siguiente = models.ForeignKey('self', blank=True, null=True, related_name='pasos anteriores')
	avatar = models.ForeignKey(Avatar, blank=True, null=True, related_name='pasos')
	def __unicode__(self):
		return self.numero

class Ruta(models.Model):
	pasos = models.IntegerField()
	cargo_actual = models.ForeignKey(Paso, related_name='rutas_actuales')
	cargo_inicial = models.ForeignKey(Paso, related_name='rutas_inician')
	cargo_meta = models.ForeignKey(Cargo, related_name='rutas_terminan')
	requisitos_cumplidos = models.ManyToManyField(Requisito, symmetrical=False, blank=True, null=True, related_name="rutas_dependientes")
	def __unicode__(self):
		return self.cargo_actual.nombre + ' , ' + self.pasos

class Jugador(models.Model):
	nombre = models.CharField(max_length=255, verbose_name='Nombre completo')
	sexo = models.IntegerField(choices=((1,'h',),(2,'m',),), default=1)
	correo = models.EmailField(verbose_name='Correo electronico')
	ruta = models.ForeignKey(Ruta, related_name='jugadores', blank=True, null=True)
	def __unicode__(self):
		return self.correo
		
