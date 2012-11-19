from django.conf.urls import patterns, include, url

#see https://docs.djangoproject.com/en/dev/topics/http/urls/

urlpatterns = patterns('',
	url(r'^$', 'ladder.views.home'),
	url(r'^cargo/$','ladder.views.cargo', name="get-cargos"),
	url(r'^cargo/(?P<cargo_name_fragment>[\w\s]*)/$','ladder.views.cargo', name="get-cargos-filter-by-cargo-name"),
)
