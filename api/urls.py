from django.urls import path

from api import views

urlpatterns = [
    path('columns/', views.ColumnsAPI.as_view(), name='columns'),
    path('graph/', views.GraphAPI.as_view(), name='graph'),
]
