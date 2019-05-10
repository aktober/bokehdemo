from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.template.loader import render_to_string


class IndexPage(TemplateView):
    template_name = 'index.html'


@csrf_exempt
def ajax_graph(request):
    if request.method == 'POST':
        b_script = request.POST.get('bScript')
        b_div = request.POST.get('bDiv')
        rendered = render_to_string('ajax_graph.html',
                                    {'script': b_script,
                                     'div': b_div})
        return JsonResponse({'rendered': rendered})
    else:
        return JsonResponse({'error': 'not allowed method'}, status=400)
