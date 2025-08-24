# AI Interview Assistant

Chrome extension yang membantu menjawab pertanyaan interview dengan AI secara real-time melalui floating overlay.

## Fitur Utama

- **Deteksi Otomatis**: Mendeteksi pertanyaan interview secara otomatis dari berbagai platform
- **AI-Powered**: Generate jawaban menggunakan OpenAI GPT atau Google Gemini
- **Floating Overlay**: Interface yang dapat di-lock dan di-posisikan di atas layar
- **Real-time**: Bekerja secara real-time selama sesi interview
- **Platform Support**: Mendukung HireVue, myInterview, Spark Hire, dan platform lainnya
- **Multi-bahasa**: Dukungan bahasa Indonesia dan Inggris

## Instalasi

### Metode 1: Dari Source Code
1. Download atau clone repository ini
2. Buka Chrome dan navigasi ke `chrome://extensions/`
3. Aktifkan "Developer mode" di pojok kanan atas
4. Klik "Load unpacked" dan pilih folder project ini
5. Extension akan muncul di toolbar Chrome

### Metode 2: Dari Chrome Web Store
(Akan tersedia setelah publikasi)

## Setup Awal

1. **Klik icon extension** di toolbar Chrome
2. **Pilih AI Provider**: OpenAI atau Google Gemini
3. **Masukkan API Key**:
   - OpenAI: Dapatkan dari [platform.openai.com](https://platform.openai.com/api-keys)
   - Gemini: Dapatkan dari [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **Test API Key** dengan klik tombol test
5. **Aktifkan extension** dengan toggle utama
6. **Atur preferences** sesuai kebutuhan

## Cara Penggunaan

### Automatic Mode (Recommended)
1. Buka platform interview (HireVue, myInterview, dll.)
2. Aktifkan extension melalui popup atau klik icon
3. Overlay akan muncul di pojok kanan atas
4. Extension akan otomatis mendeteksi pertanyaan baru
5. Jawaban AI akan muncul di overlay dalam beberapa detik

### Manual Mode
1. Aktifkan extension
2. Klik "Detect Question" di popup untuk force detection
3. Atau klik "Regenerate" di overlay untuk jawaban baru

### Overlay Controls
- **Minimize**: Minimize/maximize overlay
- **Lock/Unlock**: Lock/unlock posisi overlay
- **Close**: Hide overlay
- **Copy**: Copy jawaban ke clipboard
- **Regenerate**: Generate ulang jawaban

## Platform yang Didukung

### Fully Supported
- HireVue
- myInterview
- Spark Hire
- VidCruiter
- Talview
- Interview.com

### Partially Supported
- Zoom (perlu deteksi manual)
- Google Meet (perlu deteksi manual)
- Microsoft Teams (perlu deteksi manual)

### Not Supported
- Platform dengan heavy encryption
- Platform yang memblokir extensions

## Troubleshooting

### Extension Tidak Muncul
- Pastikan sudah mengaktifkan extension di popup
- Refresh halaman interview
- Periksa apakah platform didukung

### Tidak Mendeteksi Pertanyaan
- Klik "Detect Question" di popup
- Pastikan pertanyaan terlihat jelas di layar
- Coba scroll atau klik area pertanyaan

### Gagal Generate Jawaban
- Periksa API key sudah benar
- Test API key di popup
- Pastikan ada koneksi internet
- Cek limit API quota

### Overlay Tidak Muncul
- Klik icon extension dan aktifkan
- Refresh halaman
- Periksa apakah overlay ter-minimize

## Konfigurasi Lanjutan

### AI Settings
```json
{
  "aiProvider": "openai",
  "apiKey": "your-api-key",
  "responseLanguage": "id",
  "maxResponseLength": 200
}
```

### Overlay Settings
```json
{
  "overlayPosition": { "x": 20, "y": 20 },
  "overlayLocked": false,
  "autoDetect": true
}
```

## Privacy & Security

- **Local Storage**: Semua data disimpan lokal di browser
- **No Data Sharing**: Tidak ada data yang dikirim ke server pihak ketiga
- **API Keys**: Disimpan terenkripsi di local storage
- **Question History**: Hanya disimpan lokal, dapat dihapus kapan saja

## Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## Changelog

### v1.0.0 (2024-12-XX)
- Initial release
- Support untuk platform interview utama
- AI integration dengan OpenAI dan Gemini
- Floating overlay dengan drag & drop
- Auto-detection pertanyaan
- Multi-language support

## License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## Disclaimer

Extension ini dibuat untuk tujuan pembelajaran dan latihan interview. Pastikan penggunaan sesuai dengan kebijakan platform interview yang digunakan. Pengembang tidak bertanggung jawab atas penyalahgunaan extension ini.

## Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/neruanswer/issues)
- **Documentation**: [Wiki](https://github.com/your-repo/neruanswer/wiki)
- **Email**: support@neruanswer.com

---

**Made with care for interview preparation**
