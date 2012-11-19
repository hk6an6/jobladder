from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
	url(r'^$', 'ladder.views.home'),
	url(r'^cargo/$','ladder.views.cargo'),
	url(r'^cargo/(?P<cargo_name_fragment>[\w\s]*)/$','ladder.views.cargo'),
)
