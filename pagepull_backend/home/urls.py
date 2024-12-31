from django.urls import path
from . import views
from django.http import HttpResponse
urlpatterns = [
    path('', lambda request: HttpResponse(status=200)),
    path('get_dom_data/',views.get_dom_data,name='get_dom_data'),
    path('scrape_data/',views.get_generated_data,name='get_generated_data'),
]
#     path('api/get_data/', views.get_data, name='get_data'),
#     path('api/save_data/', views.save_data, name='save_data'),
# ]