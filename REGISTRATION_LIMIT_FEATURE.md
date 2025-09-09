# Fitur Batas Maksimal Pendaftar

## Ringkasan

Fitur ini memungkinkan administrator untuk mengatur batas maksimal jumlah pendaftar yang dapat mendaftar ke sistem. Ketika batas tercapai, sistem akan secara otomatis menolak pendaftaran baru.

## Cara Kerja

1. **Collection Registration Settings**: Menyimpan pengaturan batas maksimal pendaftar
2. **Validasi Otomatis**: Saat ada pendaftaran baru, sistem akan memeriksa apakah kuota masih tersedia
3. **API Endpoint**: Menyediakan endpoint untuk memeriksa status pendaftaran dan mengatur batas maksimal

## Penggunaan

### 1. Mengatur Batas Maksimal Pendaftar

Menggunakan API endpoint:
```
POST /api/admin/registration-settings
Content-Type: application/json

{
  "maxRegistrants": 100,
  "description": "Batas maksimal untuk wisuda 2025"
}
```

### 2. Memeriksa Status Pendaftaran

```
GET /api/registration-status
```

Response:
```json
{
  "isRegistrationOpen": true,
  "message": "Pendaftaran terbuka. Sisa kuota: 75",
  "maxRegistrants": 100,
  "currentRegistrants": 25,
  "remainingSlots": 75
}
```

### 3. Melalui Admin Panel

1. Buka admin panel
2. Navigasi ke "Registration Settings" di grup "Settings"
3. Atur nilai "Batas Maksimal Pendaftar"
4. Simpan perubahan

## Validasi

- Validasi hanya berjalan saat operasi `create` (pendaftaran baru)
- Validasi tidak berpengaruh pada operasi `update` (memperbarui data pendaftar yang sudah ada)
- Jika tidak ada pengaturan aktif, pendaftaran akan dibuka tanpa batas

## Error Messages

- Ketika kuota penuh: "Pendaftaran telah ditutup. Jumlah maksimal pendaftar (X) telah tercapai."
- Ketika gagal memeriksa: "Gagal memeriksa batas maksimal pendaftar"

## File yang Dimodifikasi

1. `src/collections/RegistrationSettings.ts` - Collection baru untuk menyimpan pengaturan
2. `src/collections/Registrants.ts` - Menambahkan validasi batas maksimal
3. `src/payload.config.ts` - Menambahkan collection baru ke konfigurasi
4. `src/app/api/registration-status/route.ts` - Endpoint untuk mengecek status
5. `src/app/api/admin/registration-settings/route.ts` - Endpoint admin untuk mengatur batas

## Testing

Untuk menguji fitur ini:

1. Buat pengaturan batas maksimal (misal: 5 pendaftar)
2. Coba daftarkan beberapa pendaftar sampai batas tercapai
3. Verifikasi bahwa pendaftaran ke-6 ditolak
4. Periksa status pendaftaran melalui API endpoint