# Panduan Hosting Django di cPanel dengan SQLite

## Persiapan

1. **Persiapkan SQLite Database**
   - SQLite tidak memerlukan konfigurasi database terpisah
   - Database SQLite akan dibuat secara otomatis sebagai file db.sqlite3 di direktori proyek
   - Pastikan direktori proyek memiliki izin tulis untuk membuat dan mengakses file database

2. **Siapkan File Konfigurasi**
   - Salin file `.env.example` menjadi `.env`
   - Edit file `.env` dan isi dengan informasi berikut:
     ```
     # Database settings
     # Using SQLite - No database credentials needed
     
     SECRET_KEY=kunci_rahasia_yang_aman
     ALLOWED_HOST=domain-anda.com
     DEBUG=False
     ```

## Upload Aplikasi ke cPanel

1. **Persiapkan File untuk Upload**
   - Pastikan semua file yang diperlukan sudah ada (termasuk `.env`, `.htaccess`, `passenger_wsgi.py`)
   - Pastikan `requirements.txt` sudah diperbarui

2. **Upload File ke cPanel**
   - Login ke cPanel
   - Gunakan File Manager atau FTP untuk mengupload semua file ke direktori public_html atau subdirektori

3. **Setup Python di cPanel**
   - Cari dan klik "Setup Python App" di cPanel
   - Pilih versi Python yang sesuai (3.8 atau lebih tinggi)
   - Pilih direktori aplikasi (tempat file diupload)
   - Klik "Setup"

4. **Instal Dependensi**
   - Setelah setup Python, klik "Enter to Virtual Environment"
   - Jalankan perintah: `pip install -r requirements.txt`

5. **Migrasi Database**
   - Dalam virtual environment, jalankan:
     ```
     python manage.py migrate
     ```

6. **Kumpulkan File Statis**
   - Dalam virtual environment, jalankan:
     ```
     python manage.py collectstatic --noinput
     ```

7. **Buat Superuser (Opsional)**
   - Jika perlu akses admin, jalankan:
     ```
     python manage.py createsuperuser
     ```

## Konfigurasi Tambahan

1. **Pastikan Passenger Diaktifkan**
   - File `passenger_wsgi.py` harus ada di direktori root aplikasi

2. **Periksa Izin File**
   - Pastikan izin file diatur dengan benar (biasanya 644 untuk file dan 755 untuk direktori)

3. **Restart Aplikasi Python**
   - Di cPanel, cari "Setup Python App"
   - Pilih aplikasi Anda dan klik "Restart"

## Pemecahan Masalah

1. **Periksa Log Error**
   - Lihat file error_log di direktori aplikasi atau di cPanel (Error Log)

2. **Masalah Database**
   - Pastikan direktori aplikasi memiliki izin tulis untuk file SQLite
   - Periksa apakah file db.sqlite3 telah dibuat dengan benar

3. **Masalah Static Files**
   - Pastikan STATIC_ROOT dan MEDIA_ROOT dikonfigurasi dengan benar
   - Pastikan file .htaccess diatur dengan benar

4. **Masalah Izin**
   - Pastikan izin file dan direktori diatur dengan benar

## Catatan Penting

- Pastikan `DEBUG = False` di lingkungan produksi
- Selalu gunakan koneksi HTTPS untuk keamanan
- Cadangkan database secara teratur
- Perbarui dependensi secara berkala untuk keamanan