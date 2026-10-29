# Instructor Manager Attendance & Payroll Preparation Dashboard

Aplikasi web dashboard berbasis **React.js** dan **Tailwind CSS** yang didesain khusus untuk peran **Instructor Manager** guna mengelola jadwal, memvalidasi laporan pertemuan murid dari instruktur, dan menyusun rekapitulasi persiapan payroll untuk diteruskan ke tim Finance. Aplikasi ini berarsitektur *front-end only* dengan memadukan **REST API publik DummyJSON** untuk data profil instruktur dan **Local Relational Dataset** untuk dokumen jadwal & presensi.

---

## 🔄 Alur Bisnis & Role Persona (Business Workflow)

Aplikasi dirancang mengikuti 4 tahapan alur bisnis utama:

```
[1. Instructor Teaching Reports] ──> [2. Validasi & Klasifikasi] ──> [3. Payroll Preparation] ──> [4. Export Excel Finance]
   Laporan pertemuan murid              Periode, Instruktur, Grade,       Rekap HANYA pertemuan          Jumlah pertemuan per
   yang dibuat oleh instruktur          Kepegawaian, Status Pertemuan     yang memenuhi syarat           kategori siap diisi tarif
```

1. **Instructor Teaching Reports:** Dokumen jadwal dan laporan kehadiran pertemuan murid yang dibuat/diinput oleh instruktur.
2. **Instructor Manager Dashboard (Validasi & Klasifikasi):** Kontrol filter multi-dimensi (Periode/Date Range, Instructor, Grade 1-4, Status Kepegawaian, Status Pertemuan) untuk mengaudit kelayakan setiap sesi mengajar.
3. **Payroll Preparation:** Rekapitulasi jumlah pertemuan yang **HANYA** memenuhi syarat kelayakan payroll (payroll eligible).
4. **Export Excel untuk Finance:** Mengunduh file `.xlsx` yang memuat jumlah pertemuan per kategori, siap diisi tarif per pertemuan (*rate*) oleh tim Finance.

> ⚠️ **Prinsip Validasi Instructor Manager (Sangat Penting):**  
> **Laporan mengajar BUKAN otomatis pertemuan yang dibayar.**  
> Sesi dengan murid yang absen (**Absent**), kelas yang dibatalkan (**Cancelled**), laporan masih berupa draf (**Draft**), atau laporan terindikasi **Duplikat** tidak boleh otomatis dihitung sebagai pertemuan yang dibayar tanpa memenuhi aturan bisnis validasi yang ketat.

---

## 📌 1. Cara Menjalankan Project

### Prasyarat
- **Node.js**: Versi `v18.0.0` atau lebih baru.
- **npm**: Versi `v9.0.0` atau lebih baru.

### Langkah Instalasi & Eksekusi

1. **Clone Project dari GitHub**
   ```bash
   cd "d:/Website Project"
   git clone https://github.com/aptraka/frontend_report.git
   cd frontend_report
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Menjalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka peramban pada alamat lokal: `http://localhost:3000`.

4. **Menjalankan Automated Unit Tests (Aturan Bisnis & Payroll):**
   ```bash
   npm test
   ```

5. **Build untuk Production:**
   ```bash
   npm run build
   ```
   Bundle siap rilis akan terkompilasi optimal di folder `dist/`.

---

## 🏗️ 2. Dataset yang Dibuat & Relasi Data

Dataset frontend menggabungkan REST API publik DummyJSON dan dataset relasional lokal di [`src/data/mockData.js`](src/data/mockData.js):

### A. Grade yang Diajar (Teaching Grades)
Didefinisikan dalam 4 tingkatan:
- **`Grade 1`**
- **`Grade 2`**
- **`Grade 3`**
- **`Grade 4`**
> *Aturan Relasi:* Data **Teaching Grade** diekstrak langsung dari **dokumen jadwal murid**.

### B. Status Instruktur (Employment Status)
Didefinisikan dalam 3 kategori kepegawaian:
- **`Full-time`**
- **`Part-time`**
- **`Freelance`**
> *Aturan Relasi:* Data **Employment Status** diekstrak langsung dari **profil Instruktur** (dimapping ke data profil DummyJSON).

### C. Status Dokumen Jadwal Murid (Schedule Documents)
Mencerminkan siklus hidup perencanaan sesi belajar:
- **`Draft`** *(Rancangan awal, belum disubmit instruktur)* $\rightarrow$ **Excluded**
- **`Submitted`** *(Laporan sesi resmi telah diserahkan instruktur)* $\rightarrow$ **Kandidat Valid**
- **`Cancelled`** *(Sesi dibatalkan)* $\rightarrow$ **Excluded**

### D. Status Dokumen Kehadiran Murid (Attendance Documents)
Mencerminkan presensi faktual murid pada jadwal terkait:
- **`Scheduled`** *(Jadwal terdaftar, namun belum berlangsung)* $\rightarrow$ **Excluded**
- **`Attended`** *(Murid hadir dan mengikuti sesi pembelajaran)* $\rightarrow$ **Kandidat Valid**
- **`Absent`** *(Murid tidak hadir / izin sakit)* $\rightarrow$ **Excluded**

### E. Deteksi Laporan Duplikat
Sistem secara otomatis mendeteksi jika terdapat laporan ganda dengan instuktur, murid, tanggal, dan jam yang sama, serta menandainya sebagai **`DUPLICATE` (Excluded)** agar tidak terhitung ganda dalam payroll.

---

## ⚖️ 3. Aturan Bisnis & Logika Payroll (Business Rules)

Diimplementasikan pada [`src/utils/payrollLogic.js`](src/utils/payrollLogic.js):

1. **Kondisi Valid:**
   HANYA jadwal dengan:
   $$\text{Schedule Status} == \text{'Submitted'} \quad \text{DAN} \quad \text{Attendance Status} == \text{'Attended'}$$
   yang dihitung masuk ke dalam rekapitulasi payroll.

2. **Kondisi Invalid (Strictly Exclude):**
   Jika status jadwal adalah **`Draft`** atau **`Cancelled`**, ATAU status kehadiran adalah **`Scheduled`** atau **`Absent`**, ATAU terindikasi **`Duplikat`**, maka data tersebut **TIDAK BOLEH** masuk ke dalam hitungan payroll (skip/exclude).

3. **Filter Rentang Waktu (Selected Date Range):**
   Rekapitulasi payroll dihitung ulang secara dinamis sesuai dengan rentang tanggal yang dipilih pengguna (misal: *Bulan Ini (Okt 2026)*, *Bulan Lalu (Sep 2026)*, atau tanggal kustom).

4. **Integritas Relasi Data:**
   - Data *Teaching Grade* diekstrak dari dokumen jadwal murid.
   - Data *Employment Status* diekstrak dari profil instruktur.

---

## 📦 4. Daftar Additional Libraries & Fungsinya

| Library | Versi | Alasan & Fungsinya dalam Aplikasi |
| :--- | :--- | :--- |
| **`xlsx`** *(SheetJS)* | `^0.18.5` | **Export Spreadsheet Excel (.xlsx):** Bertugas mengonversi rekapitulasi payroll menjadi file Excel resmi multi-sheet untuk tim Finance. Sheet 1 berisi ringkasan jumlah pertemuan per kategori per instruktur dengan kolom tarif kosong yang siap diisi Finance. Sheet 2 menyajikan *Audit Log* sesi valid sebagai bukti audit. |
| **`lucide-react`** | `^0.460.0` | **Visual Icons:** Menyediakan ikon SVG yang ringan, konsisten, dan mudah dikenali (Calendar, Clock, CheckCircle, XCircle, FileSpreadsheet, Sliders, Users, AlertTriangle). |
| **`tailwindcss`** | `^3.4.14` | **Modern Styling:** Membangun antarmuka dashboard responsif dengan visual hierarchy yang jelas antara status valid (hijau) dan excluded (merah/abu-abu). |
| **`clsx`** & **`tailwind-merge`** | `^2.1.1` | **Dynamic Class Management:** Menggabungkan kelas CSS secara kondisional tanpa konflik selector. |

---

## 📊 5. Format File Excel untuk Tim Finance

File Excel hasil ekspor ([`src/utils/exportExcel.js`](src/utils/exportExcel.js)) dirancang khusus untuk alur kerja Finance:

- **Sheet 1: `Rekap_Payroll_Finance`**
  - **Header Dokumen:** Judul resmi, nama verifikator (*Instructor Manager*), periode cut-off, dan catatan aturan validasi.
  - **Kolom Tabel:**
    1. No
    2. Nama Instruktur
    3. Status Kepegawaian (`Full-time` / `Part-time` / `Freelance`)
    4. Pertemuan Grade 1
    5. Pertemuan Grade 2
    6. Pertemuan Grade 3
    7. Pertemuan Grade 4
    8. Total Pertemuan Memenuhi Syarat
    9. **Tarif per Pertemuan (Rp) [Kolom Kosong Siap Diisi Tim Finance]**
    10. Total Pembayaran Honor (Rp) [Simulasi / Rumus Finance]
    11. Verifikasi / Tanda Tangan Tim Finance
  - **Baris Total:** Akumulasi total pertemuan per grade dan total sesi secara menyeluruh.

- **Sheet 2: `Audit_Log_Sesi_Valid`**
  - Menyajikan log detail setiap sesi yang lolos verifikasi (Kode Jadwal, Tanggal, Jam, Nama Murid, Grade, Topik, Jam Check-In, Catatan Presensi, dan Supervisor).

---

## 📁 6. Struktur Direktori Project

```text
frontend_test/
├── dist/                              # Output build production Vite
├── src/
│   ├── api/
│   │   └── instructorApi.js           # REST API integration DummyJSON & fallback
│   ├── components/
│   │   ├── Header.jsx                 # Top bar branding & indikator peran Instructor Manager
│   │   ├── BusinessFlowBanner.jsx     # Visual Alur Bisnis 4 Langkah & Prinsip Validasi
│   │   ├── MetricCards.jsx            # 5 Kartu metrik KPI (Total, Valid, Excluded, Instruktur, Estimasi)
│   │   ├── FilterBar.jsx              # Kontrol Validasi & Klasifikasi (Periode, Instruktur, Grade, Status)
│   │   ├── PayrollSummaryTable.jsx    # Rekapitulasi Payroll (HANYA Sesi Memenuhi Syarat) & Tombol Ekspor
│   │   ├── TeachingReportsTable.jsx   # Laporan Pertemuan Murid (Seluruh Sesi & Audit Status)
│   │   └── SessionDetailModal.jsx     # Modal komparasi Dokumen Jadwal vs Dokumen Presensi
│   ├── data/
│   │   ├── fallbackInstructors.js     # Data cadangan instruktur DummyJSON (offline-safe)
│   │   └── mockData.js                # Dataset relasional (Metadata, Jadwal Murid, Presensi Murid)
│   ├── types/
│   │   └── constants.js               # Definisi Grades 1-4, Status Pegawai, Status Dokumen, Tarif Default
│   ├── utils/
│   │   ├── dateUtils.js               # Helper pemformatan & filter rentang tanggal
│   │   ├── exportExcel.js             # Generator workbook Excel .xlsx (Rekapitulasi + Audit Log)
│   │   └── payrollLogic.js            # Evaluator aturan bisnis payroll & deteksi duplikat
│   ├── App.jsx                        # Komponen utama & state management
│   ├── index.css                      # Tailwind base & custom font
│   └── main.jsx                       # Entry point React
├── test/
│   └── payrollLogic.test.js           # Automated Unit Tests untuk aturan bisnis payroll
├── index.html                         # Template HTML utama
├── package.json                       # Konfigurasi dependensi & npm scripts
├── postcss.config.js                  # PostCSS plugin Tailwind
├── tailwind.config.js                 # Konfigurasi Tailwind theme
├── vite.config.js                     # Konfigurasi Vite & code-splitting
└── README.md                          # Dokumentasi lengkap alur bisnis & panduan teknis
```
