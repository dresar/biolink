import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'linkbio.settings')
import django
django.setup()
from core.models import Product

p = Product.objects.first()
if p:
    p.is_active = True
    p.save()
    print(f'Produk {p.title} sekarang aktif: {p.is_active}')
else:
    print('Tidak ada produk dalam database')