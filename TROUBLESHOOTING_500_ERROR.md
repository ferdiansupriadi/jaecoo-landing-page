# 🚨 TROUBLESHOOTING - INTERNAL SERVER ERROR 500

## 🔍 PENYEBAB UMUM ERROR 500

### 1. ✅ SUDAH DIFIX - .htaccess Issues
**Masalah:** Security headers atau rewrite rules terlalu strict
**Solusi:** Simplifikasi .htaccess (sudah dilakukan)
- ✅ Hapus HSTS header (bisa conflict dengan non-HTTPS)
- ✅ Hapus CSP header (terlalu strict)
- ✅ Hapus Permissions-Policy (tidak perlu)
- ✅ Simplifikasi rewrite rules
- ✅ Gunakan Deny from all bukan Require all denied (lebih compatible)

---

## ❓ DIAGNOSTIC CHECKLIST

### Langkah 1: Cek Error Log Server
```bash
# SSH ke server dan lihat error log
tail -f /var/log/apache2/error.log
# Atau
tail -f /var/log/httpd/error.log

# Catat error message yang muncul
```

### Langkah 2: Cek PHP Version
```bash
php -v
# Pastikan PHP version compatible
```

### Langkah 3: Cek Module Apache
```bash
# Check apakah mod_rewrite aktif
apache2ctl -M | grep rewrite

# Check apakah mod_headers aktif
apache2ctl -M | grep headers

# Check apakah mod_deflate aktif
apache2ctl -M | grep deflate
```

### Langkah 4: Test .htaccess Syntax
```bash
# SSH ke direktori website
cd /var/www/html

# Check syntax
apachectl configtest
# Harus output: "Syntax OK"
```

---

## 🛠️ SOLUSI STEP-BY-STEP

### SOLUSI 1: Replace .htaccess dengan Versi Simplified (RECOMMENDED)

**File baru sudah tersedia dengan:**
- ✅ Simplified rewrite rules
- ✅ Removed problematic headers
- ✅ Compatible dengan lebih banyak server
- ✅ Tetap maintain security basics

**Cara:**
```bash
# 1. Backup .htaccess lama
cp .htaccess .htaccess.backup

# 2. Upload .htaccess baru yang simplified
# (Sudah disediakan di file)

# 3. Test apakah error masih ada
curl -I https://yourdomain.com/index.html
curl -I https://yourdomain.com/j7.html
```

---

### SOLUSI 2: Disable Rewrite Rules Temporarily

Jika masih error, coba disable rewrite rules:

```apache
# Ganti section ini:
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Jangan rewrite jika file atau folder sudah ada
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # Hapus .html dari URL
    RewriteRule ^([^\.]+)$ $1.html [NC,L]
</IfModule>

# Dengan:
<IfModule mod_rewrite.c>
    RewriteEngine Off
    # Temporarily disabled for debugging
</IfModule>
```

Test apakah error hilang:
```bash
curl -I https://yourdomain.com/j7.html
# Harus bisa akses dengan .html
```

Jika error hilang, berarti rewrite rules yang bermasalah.

---

### SOLUSI 3: Disable Security Headers Temporarily

Jika rewrite OK tapi masih error, coba disable headers:

```apache
# Hanya gunakan headers ini:
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
</IfModule>

# Disable CSP, HSTS, Permissions-Policy dulu
```

---

### SOLUSI 4: Check Script Errors

Jika .htaccess sudah OK, mungkin ada error di scripts:

```bash
# 1. Test PHP syntax
php -l index.html
php -l scripts-index.js  # Not needed, JS files OK

# 2. Check browser console (F12)
# Lihat apakah ada JS errors

# 3. Check apakah config.js loading
# Cari di Network tab apakah config.js 200 atau error
```

---

## 🚨 JIKA MASIH ERROR

Ini adalah format error yang biasanya muncul. Kumpulkan info ini:

```
1. Error message dari server log:
   ___________________________________
   
2. Halaman yang error:
   - Semua kecuali index? ___________________________________
   
3. Akses ke /backend/visitor-count.php:
   Berhasil / Error ___________________________________
   
4. PHP version:
   ___________________________________
   
5. Web server:
   Apache / Nginx / Other: ___________________________________
   
6. Modules aktif (dari apache2ctl -M):
   ___________________________________
```

---

## ✅ VERIFICATION STEPS

Setelah apply solusi, verify dengan:

```bash
# 1. Cek .htaccess syntax
apachectl configtest
# Expected: Syntax OK

# 2. Restart Apache
sudo systemctl restart apache2
# Atau
sudo service httpd restart

# 3. Test halaman
curl -I https://yourdomain.com/
curl -I https://yourdomain.com/j7.html
curl -I https://yourdomain.com/j8.html

# 4. Check error log bersih
tail /var/log/apache2/error.log
# Seharusnya tidak ada error baru
```

---

## 📝 COMMON ERROR MESSAGES

### Error: 500 Internal Server Error
**Penyebab:** .htaccess syntax error atau module tidak aktif
**Fix:** 
1. Cek apachectl configtest
2. Enable mod_rewrite: `a2enmod rewrite`
3. Restart Apache

### Error: PHP Parse Error
**Penyebab:** Syntax error di PHP file
**Fix:**
1. Cek PHP syntax: `php -l filename`
2. Check file encoding (harus UTF-8)

### Error: Rewrite Loop
**Penyebab:** Rewrite rules conflict
**Fix:**
1. Disable rewrite rules
2. Simplify rewrite logic
3. Add [L] flag ke akhir rule

### Error: Header Already Sent
**Penyebab:** Output sebelum header
**Fix:**
1. Pastikan tidak ada output sebelum `<?php`
2. Pastikan file tidak ada BOM (Byte Order Mark)

---

## 🔧 FALLBACK OPTIONS

Jika .htaccess terus bermasalah:

### Option 1: Disable Rewrite (Akses dengan .html)
```
Users akses: https://yourdomain.com/index.html
Bukan: https://yourdomain.com/
```

### Option 2: Use nginx instead of Apache
Nginx tidak pakai .htaccess, lebih stabil.

### Option 3: Minimal .htaccess
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ $1.html [L]
</IfModule>
```

---

## 📞 NEXT STEPS

1. **Test dengan .htaccess baru (simplified)**
   - Upload file .htaccess yang sudah disederhanakan
   - Test apakah error hilang

2. **Jika masih error:**
   - Cek error log: `tail -f /var/log/apache2/error.log`
   - Catat error message
   - Share error message dengan saya

3. **Saat testing:**
   - Clear browser cache (Ctrl+Shift+Del)
   - Test di incognito/private window
   - Cek beberapa halaman (index.html, j7.html, j8.html)

---

## ✅ QUICK FIX CHECKLIST

```
[ ] Backup .htaccess lama
[ ] Upload .htaccess simplified
[ ] Restart Apache (atau via cPanel)
[ ] Clear browser cache
[ ] Test index.html
[ ] Test j7.html
[ ] Test j8.html
[ ] Check error log bersih
[ ] Verify security headers dengan curl
```

---

## 📊 STATUS

**Original .htaccess:** Terlalu strict, banyak headers bermasalah
**Simplified .htaccess:** ✅ Lebih stabil, tetap maintain security

**Rekomendasi:** Upload .htaccess baru, test, dan laporkan hasilnya!

---

Jika masih error, saya akan membuat backup .htaccess yang super minimal untuk troubleshooting.
