# MindVault

MindVault adalah aplikasi "Second Brain" yang dirancang untuk membantu Anda mengelola pengetahuan dan melakukan interaksi dengan AI (didukung oleh Gemini 1.5 Pro). Aplikasi ini memungkinkan pengguna untuk melakukan chat, mengunggah berbagai sumber pengetahuan (PDF, URL, Catatan), dan mencari serta merangkum informasi dengan mudah di dalam satu *workspace* yang terintegrasi.

## Fitur Utama

*   **Smart Chat Interface:** Chatbot responsif yang menggunakan model AI (Gemini 1.5 Pro) untuk membantu mensintesis informasi, merangkum catatan, dan menjawab pertanyaan.
*   **Knowledge Workspace (Navigation Drawer):** Menu samping (sidebar) yang memberikan akses cepat untuk:
    *   Membuat sesi chat baru.
    *   Mengunggah file (drag & drop area atau tombol khusus untuk PDF, URL, dan Catatan Baru).
    *   Melihat riwayat chat dan sumber informasi (Recent Sources).
*   **Modern Jetpack Compose UI:** Desain antarmuka (UI) menggunakan Android Jetpack Compose Material 3 dengan gaya bersih, modern, dan tata letak yang ramah pengguna.
*   **Local Database:** Riwayat percakapan disimpan secara lokal menggunakan Room Database.

## Tampilan UI (Desain Baru)

Desain UI telah diperbarui untuk mereplikasi fungsionalitas dan estetika yang lebih modern, meliputi:
- Tema warna bernuansa **Primary Purple/Blue** (BrandPrimary).
- **Navigation Drawer** (Hamburger Menu) yang menampung manajemen file dan chat.
- **Empty State Chat:** Tampilan sapaan ("How can I help you today?") yang elegan saat pertama kali membuka aplikasi.
- **Chat Input Bar:** Input teks dengan tombol attachment `+` dan tombol kirim `↑` berbentuk bulat.
- **Assistant Indicator:** Indikator visual khusus untuk bubble pesan AI (Assistant).

## Persyaratan Sistem

- **Minimum SDK:** 26 (Android 8.0)
- **Target SDK:** 35
- **Android Studio:** Versi terbaru yang mendukung Jetpack Compose dan Gradle 8.x/9.x.

## Cara Build dan Run

1.  **Clone Repository ini** ke mesin lokal Anda.
2.  Buka project di **Android Studio**.
3.  Tunggu hingga Gradle menyelesaikan proses sinkronisasi (sync).
4.  Jalankan aplikasi di Emulator atau Perangkat Android asli dengan menekan tombol **Run** (Shift + F10), atau gunakan terminal:
    ```bash
    ./gradlew assembleDebug
    ```

## Teknologi yang Digunakan

*   **Bahasa:** Kotlin
*   **UI Framework:** Jetpack Compose
*   **Architecture Components:** ViewModel, Room Database
*   **Networking:** Retrofit & Gson (disiapkan untuk komunikasi API)

## Catatan Tambahan

Aplikasi ini saat ini memuat UI interaktif dan penyimpanan lokal untuk chat. Integrasi fungsional backend (seperti unggah file dan komunikasi dengan API AI/LLM asli) sedang dalam pengembangan.
