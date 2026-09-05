from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth.models import User
from .models import WhatsAppTemplate, Service, Product, SocialMedia, SiteSettings
from .admin import ServiceForm, ProductForm, SocialMediaForm, WhatsAppTemplateForm, SiteSettingsForm
import json
from django.urls import reverse


def home(request):
    services = Service.objects.filter(is_active=True).order_by('order')
    products = Product.objects.filter(is_active=True).order_by('order')
    socials = SocialMedia.objects.filter(is_active=True).order_by('order')
    site_settings = SiteSettings.objects.first()
    whatsapp_templates = WhatsAppTemplate.objects.filter(is_active=True).order_by('order')
    
    context = {
        'services': services,
        'products': products,
        'socials': socials,
        'site_settings': site_settings,
        'whatsapp_templates': whatsapp_templates,
    }
    
    return render(request, 'core/home.html', context)


@login_required
def service_preview(request, service_id):
    """Preview endpoint for service"""
    try:
        service = Service.objects.get(id=service_id)
        data = {
            'id': service.id,
            'title': service.title,
            'description': service.description,
            'icon_url': service.icon.url if service.icon else '',
            'color': service.color,
            'gradient_color': service.gradient_color,
            'gradient_type': service.gradient_type,
            'gradient_direction': service.gradient_direction,
        }
        return JsonResponse({'status': 'success', 'data': data})
    except Service.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Service not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@login_required
def product_preview(request, product_id):
    """Preview endpoint for product in admin"""
    try:
        product = Product.objects.get(id=product_id)
        
        # Get additional images
        additional_images = []
        for img in product.images.all().order_by('order'):
            additional_images.append({
                'id': img.id,
                'url': img.image.url,
                'order': img.order
            })
            
        data = {
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'image_url': product.image.url if product.image else '',
            'price': str(product.price),
            'discount_price': str(product.discount_price) if product.discount_price else None,
            'link': product.link,
            'link_label': product.link_label,
            'additional_link': product.additional_link,
            'additional_link_label': product.additional_link_label,
            'images': additional_images
        }
        return JsonResponse({'status': 'success', 'data': data})
    except Product.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Product not found'}, status=404)


def product_detail(request, product_id):
    """Public endpoint for product detail"""
    try:
        product = Product.objects.get(id=product_id, is_active=True)
        
        # Get additional images
        additional_images = []
        for img in product.images.all().order_by('order'):
            additional_images.append({
                'id': img.id,
                'url': img.image.url,
                'order': img.order
            })
        
        data = {
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'image_url': product.image.url if product.image else '',
            'price': str(product.price),
            'discount_price': str(product.discount_price) if product.discount_price else None,
            'link': product.link,
            'link_label': product.link_label,
            'additional_link': product.additional_link,
            'additional_link_label': product.additional_link_label,
            'images': additional_images
        }
        return JsonResponse({'status': 'success', 'data': data})
    except Product.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Product not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@login_required
def social_preview(request, social_id):
    """Preview endpoint for social media"""
    try:
        social = SocialMedia.objects.get(id=social_id)
        data = {
            'id': social.id,
            'platform': social.platform,
            'username': social.username,
            'link': social.link,
            'icon': social.icon,
        }
        return JsonResponse({'status': 'success', 'data': data})
    except SocialMedia.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Social media not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

# Admin Login View
def admin_login(request):
    if request.user.is_authenticated:
        return redirect('admin_dashboard')
        
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('admin_dashboard')
        else:
            messages.error(request, 'Username atau password salah')
    
    return render(request, 'core/admin/login.html')

# Admin Logout View
@login_required(login_url='admin_login')
def admin_logout(request):
    logout(request)
    return redirect('admin_login')

# Admin Dashboard View
@login_required(login_url='admin_login')
def admin_dashboard(request):
    services_count = Service.objects.count()
    products_count = Product.objects.count()
    social_media_count = SocialMedia.objects.count()
    whatsapp_count = WhatsAppTemplate.objects.count()
    site_settings = SiteSettings.objects.first()
    
    context = {
        'services_count': services_count,
        'products_count': products_count,
        'social_media_count': social_media_count,
        'whatsapp_count': whatsapp_count,
        'site_settings': site_settings,
    }
    
    return render(request, 'core/admin/dashboard.html', context)

# Service Admin Views
@login_required(login_url='admin_login')
def admin_service_list(request):
    services = Service.objects.all().order_by('order')
    form = ServiceForm()
    
    context = {
        'services': services,
        'form': form,
    }
    
    return render(request, 'core/admin/service_list.html', context)

@login_required(login_url='admin_login')
def admin_service_add(request):
    if request.method == 'POST':
        form = ServiceForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Layanan berhasil ditambahkan'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Metode tidak diizinkan'})

@login_required(login_url='admin_login')
def admin_service_edit(request, pk):
    service = get_object_or_404(Service, pk=pk)
    
    if request.method == 'POST':
        form = ServiceForm(request.POST, request.FILES, instance=service)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Layanan berhasil diperbarui'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    
    form = ServiceForm(instance=service)
    # Ensure color values are in valid hex format for HTML color inputs
    color = service.color
    if not color or not color.startswith('#'):
        color = '#000000'  # Default to black if no valid color
        
    gradient_color = service.gradient_color
    if not gradient_color or not gradient_color.startswith('#'):
        gradient_color = ''  # Empty string for optional gradient color
    
    data = {
        'id': service.id,
        'title': service.title,
        'description': service.description,
        'color': color,
        'gradient_color': gradient_color,
        'gradient_type': service.gradient_type,
        'gradient_direction': service.gradient_direction,
        'order': service.order,
        'is_active': service.is_active,
        'icon_url': service.icon.url if service.icon else None,
    }
    
    return JsonResponse({'status': 'success', 'data': data})

@login_required(login_url='admin_login')
def admin_service_delete(request, pk):
    service = get_object_or_404(Service, pk=pk)
    
    if request.method == 'POST':
        service.delete()
        return JsonResponse({'status': 'success', 'message': 'Layanan berhasil dihapus'})
    
    return JsonResponse({'status': 'error', 'message': 'Metode tidak diizinkan'})

# Product Admin Views
@login_required(login_url='admin_login')
def admin_product_list(request):
    products = Product.objects.all().order_by('order')
    form = ProductForm()
    
    context = {
        'products': products,
        'form': form,
    }
    
    return render(request, 'core/admin/product_list.html', context)

@login_required(login_url='admin_login')
def admin_product_add(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save()
            
            # Handle additional images
            if request.FILES.getlist('additional_images'):
                for i, img_file in enumerate(request.FILES.getlist('additional_images')):
                    ProductImage.objects.create(
                        product=product,
                        image=img_file,
                        order=i+1
                    )
                    
            return JsonResponse({'status': 'success', 'message': 'Produk berhasil ditambahkan'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Metode tidak diizinkan'})

@login_required(login_url='admin_login')
def admin_product_edit(request, pk):
    product = get_object_or_404(Product, pk=pk)
    
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            
            # Handle additional images
            if request.FILES.getlist('additional_images'):
                for img_file in request.FILES.getlist('additional_images'):
                    ProductImage.objects.create(
                        product=product,
                        image=img_file,
                        order=product.images.count() + 1
                    )
                    
            return JsonResponse({'status': 'success', 'message': 'Produk berhasil diperbarui'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    
    form = ProductForm(instance=product)
    
    # Get additional images
    additional_images = []
    for img in product.images.all().order_by('order'):
        additional_images.append({
            'id': img.id,
            'url': img.image.url,
            'order': img.order
        })
    
    data = {
        'id': product.id,
        'title': product.title,
        'description': product.description,
        'price': product.price,
        'discount_price': product.discount_price,
        'link': product.link,
        'link_label': product.link_label,
        'additional_link': product.additional_link,
        'additional_link_label': product.additional_link_label,
        'order': product.order,
        'is_active': product.is_active,
        'image_url': product.image.url if product.image else None,
        'additional_images': additional_images
    }
    
    return JsonResponse({'status': 'success', 'data': data})

@login_required(login_url='admin_login')
def admin_product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    
    if request.method == 'POST':
        product.delete()
        return JsonResponse({'status': 'success', 'message': 'Produk berhasil dihapus'})
    
    return JsonResponse({'status': 'error', 'message': 'Metode tidak diizinkan'})

# Social Media Admin Views
@login_required(login_url='admin_login')
def admin_social_list(request):
    social_media = SocialMedia.objects.all().order_by('order')
    form = SocialMediaForm()
    
    context = {
        'social_media': social_media,
        'form': form,
    }
    
    return render(request, 'core/admin/social_list.html', context)

@login_required(login_url='admin_login')
def admin_social_add(request):
    if request.method == 'POST':
        form = SocialMediaForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Media sosial berhasil ditambahkan'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Metode tidak diizinkan'})

@login_required(login_url='admin_login')
def admin_social_edit(request, pk):
    social = get_object_or_404(SocialMedia, pk=pk)
    
    if request.method == 'POST':
        form = SocialMediaForm(request.POST, instance=social)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Media sosial berhasil diperbarui'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    
    form = SocialMediaForm(instance=social)
    data = {
        'id': social.id,
        'platform': social.platform,
        'username': social.username,
        'link': social.link,
        'icon': social.icon,
        'description': social.description or '',
        'order': social.order,
        'is_active': social.is_active,
    }
    
    return JsonResponse({'status': 'success', 'data': data})

@login_required(login_url='admin_login')
def admin_social_delete(request, pk):
    social = get_object_or_404(SocialMedia, pk=pk)
    
    if request.method == 'POST':
        social.delete()
        return JsonResponse({'status': 'success', 'message': 'Media sosial berhasil dihapus'})
    
    return JsonResponse({'status': 'error', 'message': 'Metode tidak diizinkan'})

@login_required(login_url='admin_login')
def admin_settings(request):
    settings = SiteSettings.get_settings()
    form = SiteSettingsForm(instance=settings)
    
    # Mendapatkan daftar admin (pengguna dengan is_staff=True)
    admins = User.objects.filter(is_staff=True).order_by('username')
    
    context = {
        'settings': settings,
        'form': form,
        'admins': admins,
    }
    
    return render(request, 'core/admin/settings.html', context)

@login_required(login_url='admin_login')
def admin_settings_update(request):
    if request.method == 'POST':
        settings = SiteSettings.objects.first()
        if not settings:
            settings = SiteSettings.objects.create()
        
        form = SiteSettingsForm(request.POST, request.FILES, instance=settings)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Pengaturan berhasil diperbarui'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@login_required(login_url='admin_login')
def admin_add(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email', '')
        
        # Validasi input
        if not username or not password:
            messages.error(request, 'Username dan password harus diisi')
            return redirect('admin_settings')
        
        # Cek apakah username sudah ada
        if User.objects.filter(username=username).exists():
            messages.error(request, f'Username {username} sudah digunakan')
            return redirect('admin_settings')
        
        # Buat user baru dengan status admin (is_staff=True)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=True
        )
        
        messages.success(request, f'Admin {username} berhasil ditambahkan')
        return redirect('admin_settings')
    
    # Jika bukan POST, redirect ke halaman settings
    return redirect('admin_settings')

@login_required(login_url='admin_login')
def admin_delete(request, user_id):
    # Pastikan user yang akan dihapus ada
    user = get_object_or_404(User, id=user_id)
    
    # Cek apakah user mencoba menghapus dirinya sendiri
    if request.user.id == user.id:
        messages.error(request, 'Anda tidak dapat menghapus akun yang sedang digunakan')
        return redirect('admin_settings')
    
    # Hapus user
    username = user.username
    user.delete()
    
    messages.success(request, f'Admin {username} berhasil dihapus')
    return redirect('admin_settings')

# WhatsApp Template Admin Views
@login_required(login_url='admin_login')
def admin_whatsapp_list(request):
    templates = WhatsAppTemplate.objects.all().order_by('order')
    form = WhatsAppTemplateForm()
    
    # Jika request adalah AJAX, kembalikan data JSON
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        templates_data = []
        for template in templates:
            templates_data.append({
                'id': template.id,
                'name': template.name,
                'message': template.message,
                'order': template.order,
                'is_active': template.is_active,
            })
        return JsonResponse({'status': 'success', 'templates': templates_data})
    
    # Jika bukan AJAX, render template HTML
    context = {
        'templates': templates,
        'form': form,
    }
    
    return render(request, 'core/admin/whatsapp_list.html', context)

@login_required(login_url='admin_login')
def admin_whatsapp_add(request):
    if request.method == 'POST':
        form = WhatsAppTemplateForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Template WhatsApp berhasil ditambahkan'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Metode tidak diizinkan'})

@login_required(login_url='admin_login')
def admin_whatsapp_edit(request, pk):
    template = get_object_or_404(WhatsAppTemplate, pk=pk)
    
    if request.method == 'POST':
        form = WhatsAppTemplateForm(request.POST, instance=template)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'message': 'Template WhatsApp berhasil diperbarui'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    
    form = WhatsAppTemplateForm(instance=template)
    data = {
        'id': template.id,
        'name': template.name,
        'message': template.message,
        'order': template.order,
        'is_active': template.is_active,
    }
    
    return JsonResponse({'status': 'success', 'data': data})

@login_required(login_url='admin_login')
def admin_whatsapp_delete(request, pk):
    template = get_object_or_404(WhatsAppTemplate, pk=pk)
    
    if request.method == 'POST':
        template.delete()
        return JsonResponse({'status': 'success', 'message': 'Template WhatsApp berhasil dihapus'})
    
    return JsonResponse({'status': 'error', 'message': 'Metode tidak diizinkan'})
