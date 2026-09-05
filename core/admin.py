# Custom admin panel implementation
from django.forms import ModelForm, TextInput, Textarea, NumberInput, CheckboxInput, Select, ClearableFileInput
from django.contrib import admin
from .models import Service, Product, ProductImage, SocialMedia, SiteSettings, WhatsAppTemplate

# Form untuk model Service
class ServiceForm(ModelForm):
    class Meta:
        model = Service
        fields = ['title', 'description', 'icon', 'link', 'color', 'gradient_color', 'gradient_type', 'gradient_direction', 'order', 'is_active']
        widgets = {
            'title': TextInput(attrs={'class': 'form-control'}),
            'description': Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'icon': ClearableFileInput(attrs={'class': 'form-control'}),
            'link': TextInput(attrs={'class': 'form-control', 'placeholder': 'https://example.com'}),
            'color': TextInput(attrs={'class': 'form-control color-picker', 'type': 'color'}),
            'gradient_color': TextInput(attrs={'class': 'form-control color-picker', 'type': 'color'}),
            'gradient_type': Select(attrs={'class': 'form-control'}),
            'gradient_direction': Select(attrs={'class': 'form-control'}),
            'order': NumberInput(attrs={'class': 'form-control'}),
            'is_active': CheckboxInput(attrs={'class': 'form-check-input'}),
        }

# Form untuk model Product
class ProductForm(ModelForm):
    class Meta:
        model = Product
        fields = ['title', 'description', 'image', 'price', 'discount_price', 'link', 'link_label', 'additional_link', 'additional_link_label', 'order', 'is_active']
        widgets = {
            'title': TextInput(attrs={'class': 'form-control'}),
            'description': Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'image': ClearableFileInput(attrs={'class': 'form-control'}),
            'price': NumberInput(attrs={'class': 'form-control'}),
            'discount_price': NumberInput(attrs={'class': 'form-control'}),
            'link': TextInput(attrs={'class': 'form-control', 'placeholder': 'https://example.com'}),
            'link_label': TextInput(attrs={'class': 'form-control', 'placeholder': 'Link Demo, Link Lainnya, dll.'}),
            'additional_link': TextInput(attrs={'class': 'form-control', 'placeholder': 'https://example.com'}),
            'additional_link_label': TextInput(attrs={'class': 'form-control', 'placeholder': 'Link Demo, Link Lainnya, dll.'}),
            'order': NumberInput(attrs={'class': 'form-control'}),
            'is_active': CheckboxInput(attrs={'class': 'form-check-input'}),
        }

# Form untuk model ProductImage
class ProductImageForm(ModelForm):
    class Meta:
        model = ProductImage
        fields = ['image', 'order']
        widgets = {
            'image': ClearableFileInput(attrs={'class': 'form-control'}),
            'order': NumberInput(attrs={'class': 'form-control'}),
        }

# Inline form untuk ProductImage
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    form = ProductImageForm
    extra = 1

# Form untuk model SocialMedia
class SocialMediaForm(ModelForm):
    class Meta:
        model = SocialMedia
        fields = ['platform', 'username', 'link', 'icon', 'description', 'order', 'is_active']
        widgets = {
            'platform': Select(attrs={'class': 'form-control'}),
            'username': TextInput(attrs={'class': 'form-control'}),
            'link': TextInput(attrs={'class': 'form-control'}),
            'icon': TextInput(attrs={'class': 'form-control'}),
            'description': Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'order': NumberInput(attrs={'class': 'form-control'}),
            'is_active': CheckboxInput(attrs={'class': 'form-check-input'}),
        }

# Form untuk model SiteSettings
class SiteSettingsForm(ModelForm):
    class Meta:
        model = SiteSettings
        fields = ['admin_name', 'admin_title', 'admin_photo', 'admin_description', 'admin_whatsapp',
                 'footer_text', 'footer_show_social', 
                 'site_title', 'site_description', 'site_keywords', 'site_favicon']
        widgets = {
            'admin_name': TextInput(attrs={'class': 'form-control'}),
            'admin_title': TextInput(attrs={'class': 'form-control'}),
            'admin_photo': ClearableFileInput(attrs={'class': 'form-control'}),
            'admin_description': Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'admin_whatsapp': TextInput(attrs={'class': 'form-control', 'placeholder': '628xxxxxxxxxx'}),
            'footer_text': TextInput(attrs={'class': 'form-control'}),
            'footer_show_social': CheckboxInput(attrs={'class': 'form-check-input'}),
            'site_title': TextInput(attrs={'class': 'form-control'}),
            'site_description': Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'site_keywords': TextInput(attrs={'class': 'form-control'}),
            'site_favicon': ClearableFileInput(attrs={'class': 'form-control'}),
        }

# Form untuk model WhatsAppTemplate
class WhatsAppTemplateForm(ModelForm):
    class Meta:
        model = WhatsAppTemplate
        fields = ['name', 'message', 'order', 'is_active']
        widgets = {
            'name': TextInput(attrs={'class': 'form-control'}),
            'message': Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'order': NumberInput(attrs={'class': 'form-control'}),
            'is_active': CheckboxInput(attrs={'class': 'form-check-input'}),
        }
