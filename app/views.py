from django.http import JsonResponse
from django.views import View
from django.views.generic import TemplateView
from django.template.loader import render_to_string


class IndexPage(TemplateView):
    template_name = 'index.html'


class AjaxGraph(View):

    def post(self, request):
        b_script = request.POST.get('bScript')
        b_div = request.POST.get('bDiv')
        rendered = render_to_string('ajax_graph.html',
                                    {'script': b_script,
                                     'div': b_div})
        return JsonResponse({'rendered': rendered})
