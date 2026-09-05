from django.db import models
from django.utils.text import slugify

class WhatsAppTemplate(models.Model):
    name = models.CharField(max_length=100, help_text='Nama template untuk referensi')
    message = models.TextField(help_text='Isi pesan template')
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['order']
        verbose_name = 'WhatsApp Template'
        verbose_name_plural = 'WhatsApp Templates'

class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='services/')
    link = models.URLField(blank=True, null=True, help_text='Link untuk layanan ini')
    color = models.CharField(max_length=50, default='blue')
    gradient_color = models.CharField(max_length=50, blank=True, null=True, help_text='Warna kedua untuk gradasi')
    gradient_type = models.CharField(max_length=20, default='linear', choices=[
        ('linear', 'Linear Gradient'),
        ('radial', 'Radial Gradient'),
    ])
    gradient_direction = models.CharField(max_length=20, default='to right', choices=[
        ('to right', 'Kanan'),
        ('to left', 'Kiri'),
        ('to bottom', 'Bawah'),
        ('to top', 'Atas'),
        ('to bottom right', 'Kanan Bawah'),
        ('to bottom left', 'Kiri Bawah'),
        ('to top right', 'Kanan Atas'),
        ('to top left', 'Kiri Atas'),
    ])
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['order']

class Product(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', help_text='Gambar utama produk (akan tetap digunakan untuk kompatibilitas)')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    link = models.URLField()
    link_label = models.CharField(max_length=50, default='Link Produk', help_text='Label untuk link produk (misalnya: Link Demo, Link Lainnya)')
    additional_link = models.URLField(blank=True, null=True, help_text='Link tambahan untuk produk')
    additional_link_label = models.CharField(max_length=50, default='Link Lainnya', blank=True, null=True, help_text='Label untuk link tambahan')
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['order']

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image {self.order} for {self.product.title}"
    
    class Meta:
        ordering = ['order']

class SocialMedia(models.Model):
    PLATFORM_CHOICES = (
        ('instagram', 'Instagram'),
        ('tiktok', 'TikTok'),
        ('github', 'GitHub'),
        ('saweria', 'Saweria'),
        ('email', 'Email'),
        ('whatsapp', 'WhatsApp'),
        ('facebook', 'Facebook'),
        ('twitter', 'Twitter'),
        ('linkedin', 'LinkedIn'),
        ('youtube', 'YouTube'),
        ('telegram', 'Telegram'),
        ('discord', 'Discord'),
        ('pinterest', 'Pinterest'),
        ('snapchat', 'Snapchat'),
        ('twitch', 'Twitch'),
        ('reddit', 'Reddit'),
        ('medium', 'Medium'),
        ('behance', 'Behance'),
        ('dribbble', 'Dribbble'),
        ('website', 'Website'),
        ('other', 'Other'),
    )
    platform = models.CharField(max_length=30, choices=PLATFORM_CHOICES)
    username = models.CharField(max_length=100)
    link = models.URLField()
    icon = models.CharField(max_length=50, help_text='Font Awesome class name')
    description = models.TextField(blank=True, null=True, help_text='Keterangan tambahan untuk media sosial')
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f'{self.platform} - {self.username}'
    
    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Social Media'

class SiteSettings(models.Model):
    # Admin Profile Settings
    admin_name = models.CharField(max_length=100, default='Admin')
    admin_title = models.CharField(max_length=100, blank=True, null=True, help_text='Jabatan atau deskripsi singkat')
    admin_photo = models.ImageField(upload_to='admin/', blank=True, null=True)
    admin_description = models.TextField(blank=True, null=True)
    admin_whatsapp = models.CharField(max_length=20, blank=True, null=True, help_text='Nomor WhatsApp (format: 628xxxxxxxxxx)')
    
    # Footer Settings
    footer_text = models.CharField(max_length=255, default='© 2023 Bio Link. All rights reserved.')
    footer_show_social = models.BooleanField(default=True, help_text='Tampilkan ikon media sosial di footer')
    
    # Site Settings
    site_title = models.CharField(max_length=100, default='Bio Link')
    site_description = models.TextField(blank=True, null=True)
    site_keywords = models.CharField(max_length=255, blank=True, null=True)
    site_favicon = models.ImageField(upload_to='site/', blank=True, null=True)
    
    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'
    
    def __str__(self):
        return 'Site Settings'
    
    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings
