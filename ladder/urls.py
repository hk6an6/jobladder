from django.conf.urls import patterns, include, url

#see https://docs.djangoproject.com/en/dev/topics/http/urls/

urlpatterns = patterns('',
	url(r'^$', 'ladder.views.home'),
	url(r'^cargo/$','ladder.views.cargo', name="get-cargos"),
	url(r'^cargo/siguientes/(?P<cargo_pk>\d+)/$','ladder.views.cargo_by_pk', name="get-cargo-by-pk"),
	url(r'^cargo/(?P<cargo_name_fragment>[\w\s]*)/$','ladder.views.cargo', name="get-cargos-filter-by-cargo-name"),
	url(r'^cargo/destinos/(?P<cargo_origen>\d+)/$','ladder.views.cargo_destino', name="get-cargos-destino"),
	url(r'^r/(?P<origin_pk>\d+)/(?P<target_pk>\d+)/(?P<sex>\w)/$','ladder.views.simulate',name="career-simulation"),
    url(r'^zona/(?P<zona_pk>\d+)/$','ladder.views.zona_by_pk',name="get-zona-by-pk"),
    url(r'^requisito/(?P<requisito_pk>\d+)/$','ladder.views.requisito_by_pk',name="get-requisito-by-pk"),
    url(r'^avatar/(?P<avatar_pk>\d+)/$','ladder.views.avatar_by_pk',name="get-avatar-by-pk"),
)
