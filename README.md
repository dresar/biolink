# Codingin Bio Link

Website bio link modern dengan Django dan SQLite untuk menampilkan layanan dan produk Codingin.

## Fitur

- Tampilan responsif dan modern
- Integrasi dengan WhatsApp
- Tampilan layanan dan produk
- Koneksi ke media sosial
- Desain yang menarik dengan animasi
- Database SQLite yang ringan dan mudah di-deploy

## Instalasi

1. Clone repositori ini
2. Buat virtual environment: `python -m venv venv`
3. Aktifkan virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Install dependensi: `pip install -r requirements.txt`
5. Jalankan migrasi: `python manage.py migrate`
6. Buat superuser: `python manage.py createsuperuser`
7. Jalankan server: `python manage.py runserver`

## Penggunaan

- Akses admin panel di `/admin` untuk mengelola konten
- Kustomisasi tampilan melalui admin panel
- Tambahkan layanan dan produk baru