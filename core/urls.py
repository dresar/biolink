from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('eka/', views.admin_login, name='admin_login'),
    path('eka/logout/', views.admin_logout, name='admin_logout'),
    path('eka/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('eka/service/', views.admin_service_list, name='admin_service_list'),
    path('eka/service/<int:pk>/', views.admin_service_edit, name='admin_service_edit'),
    path('eka/service/add/', views.admin_service_add, name='admin_service_add'),
    path('eka/service/delete/<int:pk>/', views.admin_service_delete, name='admin_service_delete'),
    path('eka/product/', views.admin_product_list, name='admin_product_list'),
    path('eka/product/<int:pk>/', views.admin_product_edit, name='admin_product_edit'),
    path('eka/product/add/', views.admin_product_add, name='admin_product_add'),
    path('eka/product/delete/<int:pk>/', views.admin_product_delete, name='admin_product_delete'),
    path('eka/social/', views.admin_social_list, name='admin_social_list'),
    path('eka/social/<int:pk>/', views.admin_social_edit, name='admin_social_edit'),
    path('eka/social/add/', views.admin_social_add, name='admin_social_add'),
    path('eka/social/delete/<int:pk>/', views.admin_social_delete, name='admin_social_delete'),
    
    # Site Settings URLs
    path('eka/settings/', views.admin_settings, name='admin_settings'),
    path('eka/settings/update/', views.admin_settings_update, name='admin_settings_update'),
    
    # Admin Management URLs
    path('eka/settings/admin/add/', views.admin_add, name='admin_add'),
    path('eka/settings/admin/delete/<int:user_id>/', views.admin_delete, name='admin_delete'),
    
    # WhatsApp Template URLs
    path('eka/whatsapp/', views.admin_whatsapp_list, name='admin_whatsapp_list'),
    path('eka/whatsapp/<int:pk>/', views.admin_whatsapp_edit, name='admin_whatsapp_edit'),
    path('eka/whatsapp/add/', views.admin_whatsapp_add, name='admin_whatsapp_add'),
    path('eka/whatsapp/delete/<int:pk>/', views.admin_whatsapp_delete, name='admin_whatsapp_delete'),
    
    # Preview URLs
    path('eka/service/preview/<int:service_id>/', views.service_preview, name='service_preview'),
    path('eka/product/preview/<int:product_id>/', views.product_preview, name='product_preview'),
    path('eka/social/preview/<int:social_id>/', views.social_preview, name='social_preview'),
    
    # Public detail endpoints
    path('product/detail/<int:product_id>/', views.product_detail, name='product_detail'),
]