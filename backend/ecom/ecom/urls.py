from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/register/', include('api.v1.register.urls')),
    path('api/v1/user/', include('api.v1.user.urls')),
    path('api/v1/manager/', include('api.v1.manager.urls')),
    path('api/v1/public/', include('api.v1.public.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
