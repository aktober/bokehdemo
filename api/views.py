import csv

from bokeh.embed import components
from bokeh.plotting import figure
from django.contrib.staticfiles.finders import find
from rest_framework.response import Response
from rest_framework.views import APIView


class ColumnsAPI(APIView):
    """
    API for retrieve column names
    """

    def get(self, request, format=None):
        path = find('Sampledata.csv')
        columns = []
        with open(path) as f:
            csv_reader = csv.reader(f, delimiter=',')
            line_count = 0
            for row in csv_reader:
                if line_count == 0:
                    columns = row
                    line_count += 1
                else:
                    break
        return Response({'columns': columns})


class GraphAPI(APIView):

    def get(self, request, format=None):
        x_column = request.GET.get('x')
        y_column = request.GET.get('y')
        path = find('Sampledata.csv')
        dataX = []
        dataY = []
        columns = []
        with open(path) as f:
            csv_reader = csv.reader(f, delimiter=',')
            line_count = 0
            for row in csv_reader:
                if line_count == 0:
                    columns = row
                    line_count += 1
                else:
                    if columns[0] == x_column:
                        dataX.append(float(row[0]))
                    else:
                        dataX.append(float(row[1]))

                    if columns[0] == y_column:
                        dataY.append(float(row[0]))
                    else:
                        dataY.append(float(row[1]))

                    line_count += 1

        TOOLS = "hover,crosshair,pan,tap,save,box_select,poly_select,lasso_select,"
        p = figure(tools=TOOLS)
        p.scatter(dataX, dataY, fill_color='red', fill_alpha=0.6, line_color='red')
        script, div = components(p)
        return Response({'script': script,
                         'div': div})

