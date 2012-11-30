from django.conf.urls import patterns, include, url

#see https://docs.djangoproject.com/en/dev/topics/http/urls/

urlpatterns = patterns('',
	url(r'^$', 'ladder.views.home'),
	url(r'^cargo/$','ladder.views.cargo', name="get-cargos"),
	url(r'^cargo/siguientes/(?P<cargo_pk>\d+)/$','ladder.views.cargo_by_pk', name="get-cargo-by-pk"),
	url(r'^cargo/(?P<cargo_name_fragment>[\w\s]*)/$','ladder.views.cargo', name="get-cargos-filter-by-cargo-name"),
	url(r'^cargo/destinos/(?P<cargo_origen>\d+)/$','ladder.views.cargo_destino', name="get-cargos-destino"),
	url(r'^ae/(?P<origin_pk>\d+)/(?P<target_pk>\d+)/(?P<sex>\w)/$','ladder.views.create_avatar',name="avatar-editor"),
	url(r'^r/(?P<origin_pk>\d+)/(?P<target_pk>\d+)/(?P<sex>\w)/$','ladder.views.simulate',name="career-simulation"),
    url(r'^zona/(?P<zona_pk>\d+)/$','ladder.views.zona_by_pk',name="get-zona-by-pk"),
    url(r'^requisito/(?P<requisito_pk>\d+)/$','ladder.views.requisito_by_pk',name="get-requisito-by-pk"),
    url(r'^avatar/(?P<avatar_pk>\d+)/$','ladder.views.avatar_by_pk',name="get-avatar-by-pk"),
	url(r'^avatar/cuerpo/(?P<cuerpo_pk>\d+)/$','ladder.views.avatar_cuerpo_by_pk',name="get-avatar-cuerpo-by-pk"),
	url(r'^avatar/camisa/(?P<camisa_pk>\d+)/$','ladder.views.avatar_camisa_by_pk',name="get-avatar-camisa-by-pk"),
	url(r'^avatar/pantalon/(?P<pantalon_pk>\d+)/$','ladder.views.avatar_pantalon_by_pk',name="get-avatar-pantalon-by-pk"),
	url(r'^avatar/cabello/(?P<cabello_pk>\d+)/$','ladder.views.avatar_cabello_by_pk',name="get-avatar-cabello-by-pk"),
	url(r'^avatar/pelo/(?P<pelo_pk>\d+)/$','ladder.views.avatar_pelo_by_pk',name="get-avatar-pelo-by-pk"),
	url(r'^avatar/faccion/(?P<faccion_pk>\d+)/$','ladder.views.avatar_faccion_by_pk',name="get-avatar-faccion-by-pk"),
	url(r'^avatar/zapatos/(?P<zapatos_pk>\d+)/$','ladder.views.avatar_zapatos_by_pk',name="get-avatar-zapatos-by-pk"),
	url(r'^avatar/cara/(?P<cara_pk>\d+)/$','ladder.views.avatar_cara_by_pk',name="get-avatar-cara-by-pk"),
	url(r'^avatar/accesorios/(?P<accesorios_pk>\d+)/$','ladder.views.avatar_accesorios_by_pk',name="get-avatar-accesorios-by-pk"),
	url(r'^avatar/sombrero/(?P<sombrero_pk>\d+)/$','ladder.views.avatar_sombrero_by_pk',name="get-avatar-sombrero-by-pk"),
	url(r'^avatar/departamento/(?P<departamento_pk>\d+)/$','ladder.views.avatar_departamento_by_pk',name="get-avatar-departamento-by-pk"),
)
