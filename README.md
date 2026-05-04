# e-SKL Digital - Frontend

e-SKL Digital (Surat Keterangan Lulus Digital) adalah sebuah platform inovatif berbasis web yang dirancang khusus untuk mempermudah sekolah dalam menerbitkan, mengelola, dan mendistribusikan Surat Keterangan Lulus (SKL) secara digital kepada siswa.

Repositori ini memuat kode sumber untuk aplikasi **Frontend** yang dibangun menggunakan **Vue 3**, **Vite**, dan **Tailwind CSS**.

## ✨ Fitur Utama

- 🎓 **Portal Publik (Pengecekan SKL)**: Siswa dapat mengecek status kelulusan mereka dan mengunduh dokumen SKL digital secara aman menggunakan kombinasi NISN dan Tanggal Lahir.
- 🔐 **Verifikasi Dokumen (QR Code)**: Memungkinkan pihak ketiga untuk memverifikasi keaslian dokumen SKL secara instan melalui sistem.
- 👨‍💻 **Dashboard Admin**: Panel administratif modern untuk mengelola data siswa, import massal dari Excel, serta pengaturan jurusan, kelas, dan periode kelulusan.
- 📱 **Desain Responsif & Premium**: Antarmuka pengguna yang dirancang dengan estetika glassmorphism dan responsif penuh untuk Desktop, Tablet, dan Mobile.
- ⚡ **Kinerja Cepat**: Dibangun dengan Vite & Vue 3 Composition API untuk waktu muat yang kilat.

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Ikonografi**: [Lucide Vue](https://lucide.dev/)

## 🚀 Memulai Proyek (Local Development)

### Persyaratan Sistem
Pastikan **Node.js** (direkomendasikan versi 18+) sudah terinstal di komputer Anda.

### Instalasi & Menjalankan Aplikasi

1. **Kloning repositori**:
   ```bash
   git clone https://github.com/rendyyanisusanto/e-skl-frontend.git
   cd e-skl-frontend
   ```

2. **Instal dependencies**:
   ```bash
   npm install
   ```

3. **Konfigurasi Lingkungan**:
   Buat file `.env` di _root directory_ dan sesuaikan _Base URL_ backend-nya (sesuaikan port jika berbeda):
   ```env
   VITE_APP_NAME=e-SKL
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

4. **Jalankan _development server_**:
   ```bash
   npm run dev
   ```

5. Buka `http://localhost:5173` pada browser Anda.

## 📦 Build untuk Produksi

Untuk melakukan _build_ project ke tahap produksi:

```bash
npm run build
```
Hasil kompilasi akan tersimpan di direktori `dist/` yang mana siap untuk dideploy ke _web server_ Anda (Nginx, Apache, Vercel, Netlify, dll).

---
*Proyek ini merupakan bagian dari ekosistem Edulite.*
