# Django settings for jobladder project.
import dj_database_url
import os

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
PROJECT_DIR = os.path.join(PROJECT_ROOT,'../jobladder')
DEBUG = False
USING_FOREMAN = os.getenv('USE_FOREMAN', False)
USE_POSGRES_USER = False
#USE_POSGRES_USER = os.getenv('USE_POSGRES_USER', False)
USE_AWS_S3_STORAGE = True
TEMPLATE_DEBUG = DEBUG
#set the following to true to inspect database queries
DEBUG_DATABASE_QUERIES = False

ADMINS = (
    ('Nicolas Diaz Aragon', 'ndiaz@serempre.com'),
    ('David Panesso', 'dpanesso@serempre.com'),
    ('Billy Camargo', 'bcamargo@serempre.com'),
	('Albina Velasco', 'avelasco@advantika.com.co'),
	('Luisa Murcia', 'lmurcia@advantika.com.co'),

)

MANAGERS = ADMINS

if USE_POSGRES_USER:
	DATABASES = {
		'default': {
			'ENGINE': 'django.db.backends.postgresql_psycopg2', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
			'NAME': 'jobladder',                      # Or path to database file if using sqlite3.
			'USER': 'posgres',                      # Not used with sqlite3.
			'PASSWORD': 'adminSerempre',                  # Not used with sqlite3.
			'HOST': 'localhost',                      # Set to empty string for localhost. Not used with sqlite3.
			'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
		}
	}
else:
	DATABASES = {
		'default': {
			'ENGINE': 'django.db.backends.postgresql_psycopg2', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
			'NAME': 'jobladder',                      # Or path to database file if using sqlite3.
			'USER': '',                      # Not used with sqlite3.
			'PASSWORD': '',                  # Not used with sqlite3.
			'HOST': 'localhost',                      # Set to empty string for localhost. Not used with sqlite3.
			'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
		}
	}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/Bogota'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = ''#os.path.join(PROJECT_DIR, 'static/')

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(PROJECT_DIR,'static/'),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'a_fff4#ro^^+d9nwo9p*hp28mlc786xyv0_78&amp;g9x=s!%j-2-%'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'jobladder.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'jobladder.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(PROJECT_DIR, 'templates'),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    'django.contrib.admindocs',
    'gunicorn',
    'ladder',
    'storages',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
if DEBUG_DATABASE_QUERIES:
	LOGGING = {
		'version': 1,
		'disable_existing_loggers': False,
		'formatters': {
			'verbose': {
				'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
			},
			'simple': {
				'format': '%(levelname)s %(message)s'
			},
		},
		'filters': {
			'require_debug_false': {
				'()': 'django.utils.log.RequireDebugFalse'
			}
		},
		'handlers': {
			'mail_admins': {
				'level': 'ERROR',
				'filters': ['require_debug_false'],
				'class': 'django.utils.log.AdminEmailHandler'
			}, 
			'console':{
				'level':'DEBUG',
				'class':'logging.StreamHandler',
				'formatter': 'simple'
			},
		},
		'loggers': {
			'django.request': {
				'handlers': ['mail_admins','console'],
				'level': 'ERROR',
				'propagate': True,
			},
			'console':{
				'handlers': ['console'],
				'level': 'DEBUG',
				'propagate': True,
			},
			'django':{
				'handlers': ['console'],
				'level': 'DEBUG',
				'propagate': True,
			},
		}
	}
else:
	LOGGING = {
		'version': 1,
		'disable_existing_loggers': False,
		'formatters': {
			'verbose': {
				'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
			},
			'simple': {
				'format': '%(levelname)s %(message)s'
			},
		},
		'filters': {
			'require_debug_false': {
				'()': 'django.utils.log.RequireDebugFalse'
			}
		},
		'handlers': {
			'mail_admins': {
				'level': 'ERROR',
				'filters': ['require_debug_false'],
				'class': 'django.utils.log.AdminEmailHandler'
			}, 
			'console':{
				'level':'DEBUG',
				'class':'logging.StreamHandler',
				'formatter': 'simple'
			},
		},
		'loggers': {
			'django.request': {
				'handlers': ['mail_admins','console'],
				'level': 'ERROR',
				'propagate': True,
			},
			'console':{
				'handlers': ['console'],
				'level': 'DEBUG',
				'propagate': True,
			},
		}
	}


#this adds necessary settings for database to work properly when deployed to heroku
if not USING_FOREMAN:
	DATABASES['default'] = dj_database_url.config()

#the lines bellow make AWS S3 storage work
if USE_AWS_S3_STORAGE:
	STATICFILES_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
	DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
	AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID');
	AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY');
	AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME');
	S3_URL = 'http://%s.s3.amazonaws.com/' % AWS_STORAGE_BUCKET_NAME
	STATIC_URL = S3_URL

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'soporte@serempre.com'
SERVER_EMAIL = 'soporte@serempre.com'
EMAIL_HOST_PASSWORD = 'serempreAdmin'
EMAIL_SUBJECT_PREFIX = '[ Rutas de carrera - Pacific 2013 ]'
