import os
import sys

# Tambahkan direktori proyek ke sys.path
path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if path not in sys.path:
    sys.path.append(path)

# Tambahkan direktori aplikasi ke sys.path
path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.append(path)

# Setel pengaturan Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'biolink.settings')

# Impor aplikasi Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()