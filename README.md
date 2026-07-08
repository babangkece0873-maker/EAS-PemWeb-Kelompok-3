# MBG Distribution Management System

Aplikasi web untuk mengelola distribusi program **Makan Bergizi Gratis (MBG)** —
mulai dari data sekolah, vendor katering, menu, hingga pencatatan dan riwayat
distribusi harian. Dibuat sebagai proyek UAS Pemrograman Web.

## ✨ Fitur

- **Login** — autentikasi dengan username & password (NextAuth, session JWT)
- **Dashboard** — ringkasan statistik + grafik (bar, pie, line)
- **CRUD Sekolah** — kelola data sekolah penerima (nama, NPSN, jenjang, jumlah siswa, dll)
- **CRUD Vendor** — kelola data vendor/katering penyedia makanan
- **CRUD Menu** — kelola data menu makanan (kalori, harga per porsi)
- **CRUD Distribusi** — catat kegiatan distribusi (tanggal, sekolah, vendor, menu, jumlah porsi, status)
- **Riwayat Distribusi** — log seluruh distribusi dengan filter (tanggal, sekolah, vendor, status)
- **Search** — pencarian di setiap modul, plus halaman pencarian global lintas data
- **Grafik Dashboard** — tren porsi per bulan, distribusi status, tren harian (Recharts)

Tampilan responsif (mobile, tablet, desktop) dengan sidebar navigasi dan komponen modern (Tailwind CSS).

## 🛠️ Teknologi

Stack ini dipilih karena **paling stabil & sederhana untuk di-deploy ke Vercel**:

| Layer          | Teknologi                                   |
|----------------|----------------------------------------------|
| Framework      | Next.js 14 (App Router) — frontend + backend jadi satu (fullstack), native di Vercel |
| Bahasa         | TypeScript                                    |
| Styling        | Tailwind CSS                                  |
| Autentikasi    | NextAuth.js (Credentials Provider, JWT)       |
| Database ORM   | Prisma ORM                                    |
| Database (dev) | SQLite (file lokal, tanpa setup server)       |
| Database (prod)| PostgreSQL (Neon / Vercel Postgres — lihat bagian deploy) |
| Grafik         | Recharts                                      |
| Validasi       | Zod                                           |

**Arsitektur:** monolith Next.js App Router — halaman (Server & Client Components)
dan API routes (`src/app/api/**`) berada dalam satu project, memakai Prisma sebagai
lapisan akses data. Ini adalah arsitektur paling sederhana yang tetap stabil untuk
di-deploy langsung ke Vercel tanpa server terpisah.

## 📁 Struktur Folder

```
src/
  app/
    (app)/              # Halaman yang butuh login (punya sidebar & topbar)
      dashboard/
      sekolah/
      vendor/
      menu/
      distribusi/
      riwayat/
      search/
      layout.tsx         # Cek session, render AppShell
    api/                 # API routes (REST) untuk semua modul CRUD
      auth/[...nextauth]/
      sekolah/
      vendor/
      menu/
      distribusi/
      search/
    login/
    layout.tsx
    page.tsx              # redirect ke /dashboard atau /login
  components/             # CrudManager, Sidebar, Topbar, Modal, DashboardCharts, dll
  lib/                    # prisma client, auth options, utils
  middleware.ts            # proteksi route
prisma/
  schema.prisma
  seed.ts
```

## 🚀 Menjalankan di Lokal

**Prasyarat:** Node.js 18+ dan npm.

```bash
# 1. Install dependencies
npm install

# 2. Salin file environment
cp .env.example .env

# 3. Buat database SQLite + tabel-tabelnya
npx prisma migrate dev --name init

# 4. Isi data contoh (sekolah, vendor, menu, distribusi, akun login)
npm run seed

# 5. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Akun Demo

| Username   | Password      | Role     |
|------------|---------------|----------|
| `admin`    | `admin123`    | ADMIN    |
| `operator` | `operator123` | OPERATOR |

## ☁️ Deploy ke Vercel

> ⚠️ **Penting:** SQLite (file lokal) **tidak cocok** untuk Vercel karena
> filesystem pada serverless function bersifat *read-only* dan sementara —
> perubahan data akan hilang setiap deployment/instance baru. Untuk produksi,
> gunakan database **PostgreSQL** yang ter-hosting (gratis & mudah: **Neon**
> atau **Vercel Postgres**).

### Langkah-langkah:

1. **Buat database Postgres** — misalnya di [neon.tech](https://neon.tech) (gratis),
   atau lewat tab **Storage** di dashboard Vercel (Vercel Postgres). Salin
   *connection string*-nya.

2. **Ubah provider Prisma** di `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"   // sebelumnya "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Push project ini ke GitHub** (buat repo baru, lalu push seluruh folder ini).

4. **Import project di Vercel** ([vercel.com/new](https://vercel.com/new)) dan pilih repo tersebut.
   Vercel otomatis mendeteksi Next.js.

5. **Atur Environment Variables** di pengaturan project Vercel:
   - `DATABASE_URL` → connection string Postgres dari langkah 1
   - `NEXTAUTH_SECRET` → string acak (bisa generate dengan `openssl rand -base64 32`)
   - `NEXTAUTH_URL` → URL production Anda, misalnya `https://nama-project.vercel.app`

6. **Migrasi database** — cara termudah, jalankan sekali dari komputer lokal
   dengan `DATABASE_URL` yang sama seperti di Vercel:
   ```bash
   npx prisma migrate deploy
   npm run seed   # opsional, isi data contoh
   ```

7. **Deploy.** Vercel akan menjalankan `npm run build` (yang otomatis
   menjalankan `prisma generate` terlebih dahulu, lihat `package.json`).

Setelah itu aplikasi bisa diakses lewat domain Vercel dan seluruh fitur
(login, CRUD, dashboard, dsb.) akan berjalan dengan data yang persisten.

### Alternatif tanpa Postgres

Jika hanya untuk demo/presentasi UAS dan tidak butuh data yang benar-benar
persisten di production, project ini tetap bisa di-build & dijalankan dengan
SQLite untuk keperluan **lokal**. Untuk demo yang di-deploy publik, tetap
disarankan Postgres agar data tidak hilang.

## 🔑 Environment Variables

Lihat `.env.example`:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="ganti-dengan-string-acak"
NEXTAUTH_URL="http://localhost:3000"
```

## 📜 Skrip npm

| Skrip           | Keterangan                                   |
|-----------------|-----------------------------------------------|
| `npm run dev`   | Menjalankan development server                |
| `npm run build` | `prisma generate` lalu build production        |
| `npm run start` | Menjalankan hasil build production             |
| `npm run seed`  | Mengisi database dengan data contoh            |

## 📝 Catatan

- Password disimpan ter-hash dengan **bcrypt**.
- Semua route halaman & API di luar `/login` dan `/api/auth/*` dilindungi
  oleh `middleware.ts` — pengguna yang belum login otomatis diarahkan ke
  halaman login.
- Validasi input di sisi server menggunakan **Zod** pada setiap API route.
- Desain UI menggunakan Tailwind CSS dengan pendekatan mobile-first, sidebar
  otomatis menjadi drawer di layar kecil.
