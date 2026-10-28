# Instructor Manager Attendance & Payroll Preparation Dashboard

Aplikasi web dashboard berbasis **React.js** untuk manajemen jadwal, pelaporan kehadiran murid, dan rekapitulasi validasi persiapan **payroll instruktur**. Aplikasi ini berarsitektur *front-end only* dengan memadukan **REST API publik DummyJSON** untuk data profil instruktur dan **Local Relational Dataset** untuk dokumen jadwal & presensi.

---

## 📌 1. Cara Menjalankan Project

### Prasyarat
- **Node.js**: Versi `v18.0.0` atau lebih baru (direkomendasikan Node.js LTS).
- **npm**: Versi `v9.0.0` atau lebih baru.

### Langkah Instalasi & Menjalankan

1. **Clone atau Buka Direktori Project:**
   ```bash
   cd "d:/Website Project/frontend_test"
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Menjalankan Development Server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan secara lokal di: `http://localhost:3000` (atau port default Vite lainnya).

4. **Menjalankan Automated Unit Tests (Business Logic & Payroll Rules):**
   ```bash
   npm test
   ```

5. **Build untuk Production:**
   ```bash
   npm run build
   ```
   Hasil build siap di-*deploy* berada di folder `dist/`.

6. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## 🏗️ 2. Penjelasan Struktur Mock Data & Relasi Data

Aplikasi ini menggabungkan data dari dua sumber utama di sisi frontend:

### A. Data Eksternal (DummyJSON REST API)
- **Endpoint:** `https://dummyjson.com/users?limit=10`
- Digunakan untuk mengambil data profil instruktur (nama depan, nama belakang, email, avatar, nomor telepon).
- Memiliki mekanisme *graceful offline fallback* (`src/data/fallbackInstructors.js`) jika koneksi jaringan atau CORS ke API publik mengalami kendala.

### B. Local Dataset (Relational Mock Data)
File data lokal didefinisikan di [`src/data/mockData.js`](src/data/mockData.js):

#### 1. Instructor Metadata Extension
Memetakan atribut internal organisasi ke profil instruktur:
- `employment_status`: `'Full-time'`, `'Part-time'`, atau `'Freelance'` *(Sesuai aturan bisnis, diekstrak dari profil instruktur)*.
- `department`: Divisi akademik (contoh: *Mathematics Division*, *Robotics & AI*, dll).
- `staff_code`: Kode staf unik (contoh: `INS-FT-001`, `INS-PT-002`, `INS-FL-003`).

#### 2. Schedule Documents (Dokumen Jadwal Murid)
Berisi data perencanaan sesi belajar murid:
- `id`: Identitas dokumen jadwal (contoh: `SCH-2026-101`).
- `schedule_code`: Kode singkat sesi.
- `instructor_id`: *Foreign key* relasi ke user/instruktur DummyJSON.
- `student_name` & `student_id`: Data identitas murid.
- `teaching_grade`: Tingkatan murid — `'Grade 1'`, `'Grade 2'`, `'Grade 3'`, `'Grade 4'` *(Sesuai aturan bisnis, diekstrak dari dokumen jadwal)*.
- `subject`: Mata pelajaran / topik materi.
- `date`: Tanggal sesi format ISO (`YYYY-MM-DD`).
- `start_time` & `end_time`: Rentang waktu jam belajar.
- `room`: Ruang kelas / laboratorium.
- `status`: Status dokumen jadwal — `'Draft'`, `'Submitted'`, atau `'Cancelled'`.

#### 3. Attendance Documents (Dokumen Presensi Murid)
Berisi data aktual kehadiran murid pada sesi yang bersangkutan:
- `id`: Identitas dokumen presensi (contoh: `ATT-2026-101`).
- `schedule_id`: *Foreign key* relasi ke Schedule Document.
- `attendance_status`: Status presensi — `'Scheduled'`, `'Attended'`, atau `'Absent'`.
- `check_in_time`: Jam kedatangan murid (WIB).
- `student_notes`: Catatan evaluasi materi atau alasan jika murid absen/izin.
- `verified_by`: Supervisor / Academic Lead yang memverifikasi kehadiran.

---

## ⚖️ 3. Aturan Bisnis & Logika Payroll (Business Rules)

Fungsi kalkulasi payroll diimplementasikan secara ketat di [`src/utils/payrollLogic.js`](src/utils/payrollLogic.js) dengan aturan sebagai berikut:

### ✅ Kondisi Valid (Payroll Eligible)
Sebuah sesi **HANYA** dihitung masuk ke dalam rekapitulasi payroll jika memenuhi **KEDUA** syarat berikut sekaligus:
$$\text{Schedule Status} == \text{'Submitted'} \quad \text{DAN} \quad \text{Attendance Status} == \text{'Attended'}$$

### ❌ Kondisi Invalid (Strictly Excluded)
Data pertemuan **TIDAK BOLEH** masuk ke dalam hitungan payroll (langsung di-*skip/exclude*) jika terjadi salah satu kondisi:
1. Status Jadwal adalah **`Draft`** *(Instruktur belum mengirimkan/men-submit laporan akhir pertemuan)*.
2. Status Jadwal adalah **`Cancelled`** *(Jadwal telah dibatalkan)*.
3. Status Kehadiran adalah **`Scheduled`** *(Sesi belum terlaksana / belum ada konfirmasi kehadiran)*.
4. Status Kehadiran adalah **`Absent`** *(Murid tidak hadir / absen)*.

### 📅 Filter Rentang Waktu Dinamis
Rekapitulasi payroll dan KPI metrik secara dinamis mengkalkulasi ulang jumlah sesi yang valid sesuai dengan *Selected Date Range* (`startDate` dan `endDate`) yang dipilih pengguna.

### 🔗 Integritas Relasi Data
- **Teaching Grade** wajib diekstrak dari properti `teaching_grade` pada **dokumen jadwal murid**.
- **Employment Status** wajib diekstrak dari properti `employment_status` pada **profil instruktur**.

---

## 📦 4. Daftar Additional Libraries & Fungsinya

| Library | Versi | Alasan & Fungsinya dalam Aplikasi |
| :--- | :--- | :--- |
| **`xlsx`** *(SheetJS)* | `^0.18.5` | **Export Spreadsheet Excel (.xlsx):** Library utama yang bertugas mengonversi array data rekapitulasi payroll dan audit trail sesi valid ke dalam format binary workbook Microsoft Excel (`.xlsx`). Mendukung multi-sheet (Sheet Rekapitulasi Ringkasan & Sheet Audit Log Sesi Valid) serta pengaturan lebar kolom otomatis agar siap diproses tim Finance. |
| **`lucide-react`** | `^0.460.0` | **Iconography UI Modern:** Menyediakan ikon SVG yang ringan, konsisten, dan mudah diakses (seperti `Calendar`, `CheckCircle`, `XCircle`, `FileSpreadsheet`, `Filter`, `DollarSign`, `Users`). |
| **`tailwindcss`** | `^3.4.14` | **Utility-First Styling:** Membangun antarmuka dashboard yang bersih, responsif, profesional, serta mendukung palet warna status visual (hijau untuk eligible, merah/abu-abu untuk excluded, biru untuk informasi). |
| **`clsx`** & **`tailwind-merge`** | `^2.1.1` | **Utility Class Merging:** Membantu penggabungan kelas styling dinamis secara aman dan kondisional tanpa duplikasi selector CSS. |

---

## 📊 5. Fitur Utama Dashboard

1. **Ringkasan Metrik (KPI Overview Cards):**
   - *Total Sesi Pertemuan*: Menghitung total jadwal dalam filter aktif.
   - *Disetujui Payroll (Valid)*: Persentase dan jumlah sesi `Submitted + Attended`.
   - *Dikecualikan (Excluded)*: Sesi yang di-skip karena `Draft`, `Cancelled`, atau `Absent`.
   - *Instruktur Aktif*: Jumlah instruktur yang memiliki sesi eligible.
   - *Estimasi Alokasi Payroll*: Perhitungan acuan honor mengajar berdasarkan *rate per grade*.

2. **Filter & Klasifikasi Lengkap:**
   - **Periode:** Input *Dari Tanggal* & *Sampai Tanggal* dilengkapi *Quick Presets* ("Semua Periode", "Bulan Ini (Okt 2026)", "Bulan Lalu (Sep 2026)", "Dua Pekan Terakhir").
   - **Instruktur:** Filter per nama instruktur.
   - **Teaching Grade:** Filter Grade 1, Grade 2, Grade 3, Grade 4.
   - **Status Kepegawaian:** Full-time, Part-time, Freelance.
   - **Status Pertemuan:** Filter cepat untuk sesi Eligible saja, Excluded saja, atau berdasarkan status dokumen spesifik.
   - **Pencarian Bebas (Search Bar):** Pencarian teks berdasarkan nama murid, materi ajar, atau kode jadwal.
   - **Reset Filter:** Tombol sekali klik untuk mereset seluruh filter kembali ke kondisi awal.

3. **Payroll Preparation (Rekapitulasi Persiapan Payroll):**
   - Tabel ringkasan khusus yang **HANYA** menampilkan data sesi *payroll eligible*.
   - Mengelompokkan sesi per Instruktur, menampilkan Status Kepegawaian, rincian per grade (`Grade 1`, `Grade 2`, `Grade 3`, `Grade 4`), Total Sesi Disetujui, dan Estimasi Honor.
   - Dilengkapi *drawer* interaktif untuk simulasi kustomisasi tarif per grade bagi tim Finance.
   - Baris total keseluruhan (*Grand Totals*) di bagian bawah tabel.

4. **Ekspor File Excel Multi-Sheet (`.xlsx`):**
   - Tombol **"Export Excel (.xlsx)"** menghasilkan workbook profesional yang memuat:
     - **Sheet 1 (`Rekap_Payroll_Finance`):** Rekapitulasi jumlah sesi per grade per instruktur, total sesi, dan kolom khusus konfirmasi/tanda tangan tim Finance.
     - **Sheet 2 (`Audit_Log_Sesi_Valid`):** Log detail setiap baris sesi yang lolos verifikasi (Kode Jadwal, Tanggal, Jam, Nama Murid, Grade, Status Jadwal, Status Kehadiran, Jam Check-In, Catatan, Supervisor).

5. **Laporan Pertemuan Instruktur (Teaching Reports Table):**
   - Menampilkan seluruh pertemuan (baik yang valid maupun yang dikecualikan) untuk audit akademik.
   - Tab navigasi cepat: *Semua*, *Disetujui (Eligible)*, dan *Dikecualikan (Excluded)*.
   - Dilengkapi penomoran, pagination rapi, dan tombol **"Detail"** untuk membuka modal inspeksi.

6. **Modal Detail Dokumen & Presensi:**
   - Membuka perbandingan berdampingan (*side-by-side*) antara Dokumen Jadwal Murid dan Dokumen Presensi Kehadiran.
   - Memberikan penjelasan diagnosa eksplisit mengapa suatu sesi dinyatakan *Eligible* atau *Excluded*.

---

## 📁 6. Struktur Direktori Project

```text
frontend_test/
├── dist/                          # Hasil production build Vite
├── public/                        # Static public assets
├── src/
│   ├── api/
│   │   └── instructorApi.js       # Fetch REST API DummyJSON & data enrichment
│   ├── components/
│   │   ├── Header.jsx             # Top bar branding & indikator koneksi API
│   │   ├── MetricCards.jsx        # 5 Kartu metrik KPI ringkasan
│   │   ├── FilterBar.jsx          # Panel kontrol filter periode & kategori
│   │   ├── PayrollSummaryTable.jsx# Tabel Rekapitulasi Payroll (Eligible ONLY)
│   │   ├── TeachingReportsTable.jsx# Tabel seluruh laporan pertemuan instruktur
│   │   └── SessionDetailModal.jsx # Modal inspeksi detail dokumen jadwal & presensi
│   ├── data/
│   │   ├── fallbackInstructors.js # Data cadangan profil DummyJSON jika offline
│   │   └── mockData.js            # Metadata instruktur, Dokumen Jadwal, & Dokumen Presensi
│   ├── types/
│   │   └── constants.js           # Konstanta bisnis (Grades, Employment, Status, Default Rates)
│   ├── utils/
│   │   ├── dateUtils.js           # Helper format tanggal & pengecekan rentang waktu
│   │   ├── exportExcel.js         # Generator workbook XLSX (Rekap + Audit Trail)
│   │   └── payrollLogic.js        # Logika validasi bisnis & kalkulasi rekapitulasi payroll
│   ├── App.jsx                    # Komponen utama & state management
│   ├── index.css                  # Tailwind CSS import & styling global
│   └── main.jsx                   # Entry point React
├── test/
│   └── payrollLogic.test.js       # Automated Unit Tests untuk aturan bisnis payroll
├── index.html                     # HTML Template
├── package.json                   # Konfigurasi dependensi & npm scripts
├── postcss.config.js              # PostCSS config untuk Tailwind CSS
├── tailwind.config.js             # Tailwind CSS theme configuration
├── vite.config.js                 # Konfigurasi bundler Vite dengan chunk splitting
└── README.md                      # Dokumentasi komprehensif project
```
