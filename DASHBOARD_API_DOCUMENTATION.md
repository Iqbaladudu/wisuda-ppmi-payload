# API Dashboard Registrant - Dokumentasi Lengkap

## Ringkasan

Sistem sekarang memiliki API endpoints yang terintegrasi untuk mengelola batas maksimal pendaftar, status registrasi, dan analisis data lengkap. Semua data tersinkronisasi antara settings, status, dan breakdown by major.

## Endpoints Tersedia

### 1. Dashboard Registrant (Komprehensif)
```
GET /api/dashboard/registrants
```

Memberikan data lengkap dalam satu call:
- Overview (total pendaftar, batas maksimal, sisa kuota, status)
- Breakdown lengkap (jurusan, tipe, pendidikan, fakultas, gender, dll)
- Insights dan analisis
- Settings aktif

Response Example:
```json
{
  "timestamp": "2025-09-09T10:30:00.000Z",
  "overview": {
    "totalRegistrants": 150,
    "maxRegistrants": 200,
    "remainingSlots": 50,
    "isRegistrationOpen": true,
    "utilizationRate": 75,
    "avgQuranMemorization": 5.2,
    "avgStudyDuration": 4.1
  },
  "breakdowns": {
    "byMajor": [
      {
        "key": "SYARIAH_ISLAMIYAH",
        "label": "Syariah Islamiyah",
        "count": 45,
        "percentage": 30,
        "percentageOfLimit": 22.5
      }
    ],
    "byType": [...],
    "byEducation": [...],
    "byFaculty": [...],
    "byGender": [...],
    "byUniversity": [...],
    "byGraduationYear": [...],
    "byKekeluargaan": [...],
    "byContinuingStudy": [...]
  },
  "insights": {
    "mostPopularMajor": "Syariah Islamiyah",
    "mostPopularMajorCount": 45,
    "mostPopularMajorPercentage": 30,
    "genderDistribution": {
      "male": 60,
      "female": 40
    },
    "continuingStudyRate": 75
  },
  "settings": {
    "maxRegistrants": 200,
    "description": "Wisuda 2025",
    "isActive": true
  }
}
```

### 2. Registration Status (Terintegrasi dengan Breakdown)
```
GET /api/registration-status
```

Memberikan status registrasi dengan breakdown by major:
- Status pendaftaran (buka/tutup)
- Sisa kuota
- Breakdown by major dengan persentase
- Breakdown by type, education, faculty
- Settings aktif

### 3. Registrants by Major (Update)
```
GET /api/registrants-by-major
```

Sekarang menggunakan data real dari database dengan:
- Label jurusan yang readable
- Persentase per jurusan
- Persentase terhadap batas maksimal
- Summary data lengkap

### 4. Admin Registration Settings (CRUD Lengkap)
```
GET    /api/admin/registration-settings    // Ambil semua settings
POST   /api/admin/registration-settings    // Buat/update settings
PUT    /api/admin/registration-settings    // Update spesifik
DELETE /api/admin/registration-settings?id=X // Hapus settings
```

Features:
- Auto-deactivate settings lain saat aktivasi
- Validasi input
- Context info (current registrants, remaining slots)
- Support multiple settings (hanya satu yang aktif)

## Cara Penggunaan

### 1. Setup Batas Maksimal
```bash
# Set batas maksimal 200 pendaftar
curl -X POST http://localhost:3000/api/admin/registration-settings \
  -H "Content-Type: application/json" \
  -d '{
    "maxRegistrants": 200,
    "description": "Wisuda 2025",
    "is_active": true
  }'
```

### 2. Cek Status Pendaftaran
```bash
curl http://localhost:3000/api/registration-status
```

### 3. Dashboard Lengkap
```bash
curl http://localhost:3000/api/dashboard/registrants
```

### 4. Data by Major
```bash
curl http://localhost:3000/api/registrants-by-major
```

## Integrasi Data

Semua endpoint terintegrasi:

1. **Registration Settings** → Menentukan batas maksimal
2. **Validation** → Cek batas saat pendaftaran baru
3. **Status API** → Hitung sisa kuota dan status
4. **Breakdown APIs** → Analisis data dengan persentase
5. **Dashboard API** → Gabungkan semua data

## Fitur Baru

### 1. Auto-sync Data
- Perubahan settings langsung terrefleksi di semua API
- Validasi real-time saat pendaftaran
- Hitung ulang persentase otomatis

### 2. Enhanced Analytics
- Multiple breakdown dimensions
- Insights otomatis
- Trend analysis (jika data historis ada)

### 3. Admin Controls
- CRUD lengkap untuk settings
- Validation input
- Context-aware responses

### 4. Percentage Calculations
- % per kategori terhadap total
- % per kategori terhadap batas maksimal
- Utilization rate

## Error Handling

Semua endpoint memiliki error handling:
- Validasi input
- Error response yang jelas
- HTTP status codes yang appropriate

## Security

- Admin endpoints memerlukan autentikasi (sesuai setup Payload)
- Input validation
- Rate limiting (jika diimplementasikan)

## Performance

- Data caching (jika diimplementasikan)
- Efficient database queries
- Pagination untuk data besar