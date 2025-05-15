from pyramid.view import view_config


@view_config(route_name='home', renderer='backend_kopiku:templates/mytemplate.jinja2')
def my_view(request):
    return {'project': 'backend_kopiku'}
