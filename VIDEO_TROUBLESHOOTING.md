# VIDEO BANNER TROUBLESHOOTING GUIDE

## ✅ Yang Sudah Diperbaiki:
1. Video HTML sudah simplified (autoplay muted loop playsinline)
2. JavaScript paksa play dengan 4 metode berbeda
3. CSS opacity=1 (video selalu visible)
4. File test-simple.html untuk isolasi masalah

## 🔍 LANGKAH TROUBLESHOOTING:

### STEP 1: Test File Video
Buka file: `test-simple.html` 

**Jika video JALAN:**
- ✅ File video OK
- ❌ Masalah di index.html (terlalu banyak CSS/JS konflik)

**Jika video TIDAK JALAN:**
- Lihat error di alert
- Lanjut ke Step 2

### STEP 2: Buka Browser Console (F12)
1. Buka `index.html` di browser
2. Tekan F12 → tab Console
3. Cari pesan:
   - "✓ Video playing" → SUKSES
   - "⚠ Play failed:" → catat error messagenya
   - "Retry play attempt" → video coba auto-retry

### STEP 3: Cek Manual Play
1. Buka `index.html`
2. Buka Console (F12)
3. Ketik: `document.getElementById('hero-video').play()`
4. Tekan Enter

**Jika video jalan:**
- ✅ File OK, autoplay diblokir browser
- Solusi: klik/scroll halaman sekali, video akan auto-play

**Jika video tidak jalan, lihat error:**
- "NotAllowedError" → autoplay policy browser (klik halaman)
- "NotSupportedError" → format tidak didukung (pakai MP4)
- "AbortError" → file tidak bisa diload dari server

### STEP 4: Server Upload Issues

**Jika video jalan di local tapi tidak di server:**

1. Cek MIME type di server
   Tambahkan di `.htaccess` (Apache):
   ```apache
   AddType video/webm .webm
   AddType video/mp4 .mp4
   ```

   Atau `web.config` (IIS):
   ```xml
   <staticContent>
       <mimeMap fileExtension=".webm" mimeType="video/webm" />
       <mimeMap fileExtension=".mp4" mimeType="video/mp4" />
   </staticContent>
   ```

2. Cek path file di server:
   - File ada di folder yang sama dengan index.html?
   - Nama file PERSIS sama (case-sensitive)?
   - File size masih 4.22 MB (WebM) / 2.34 MB (MP4)?

3. Test direct URL:
   - Buka: `https://yoursite.com/indexBanner_pc.webm`
   - Jika 404 → file tidak ke-upload
   - Jika download → MIME type salah
   - Jika play → path salah di HTML

### STEP 5: Browser Policy
Beberapa browser blokir autoplay. Test di:
- ✅ Chrome/Edge → klik/scroll sekali
- ✅ Firefox → klik/scroll sekali
- ❌ Safari → butuh user interaction dulu

## 🛠 QUICK FIXES:

### Fix 1: Paksa Play via Console
```javascript
const v = document.getElementById('hero-video');
v.muted = true;
v.play();
```

### Fix 2: Ganti ke format lain
Edit `index.html` line 207-208:
```html
<!-- Coba MP4 saja -->
<source src="indexBanner_pc.mp4" type="video/mp4">
```

### Fix 3: Hapus semua attributes kompleks
```html
<video id="hero-video" class="hero-video" autoplay muted loop playsinline>
    <source src="indexBanner_pc.mp4" type="video/mp4">
</video>
```

## 📊 File Info:
- indexBanner_pc.webm: 4.22 MB (WebM format) ✅
- indexBanner_pc.mp4: 2.34 MB (MP4 format) ✅
- Both files are VALID

## ❓ Masih Tidak Jalan?

Kirim screenshot dari:
1. Browser Console (F12 → Console tab)
2. Network tab (F12 → Network tab, reload, cari file video, klik, lihat Headers)
3. Error message yang muncul

Atau test langsung dengan curl:
```bash
curl -I https://yoursite.com/indexBanner_pc.mp4
```
Cari baris "Content-Type: video/mp4"
