# Pdfumi Global News (`news.pdfumi.com`)

Portal berita global multibahasa (**Bahasa Indonesia, English, 日本語**) berkinerja tinggi yang dibangun dengan **Clean Architecture**, prinsip **SOLID**, dan standar transformatif multi-sumber (100% aman hak cipta, legal, dan patuh standar Google E-E-A-T).

---

## 🌟 Fitur Utama

1. **Multibahasa Penuh (i18n)**:
   - Bahasa Indonesia (`/id`), Global English (`/en`), dan 日本語 (`/ja`).
   - Tag `hreflang` otomatis dan kanonikal untuk mencegah penalti duplikat konten.
2. **Karya Transformatif & Bebas Hak Cipta**:
   - Aturan verifikasi minimal 2-3 sumber independen terpercaya (Reuters, AP, NHK, BBC, Jurnal Sains).
   - Kotak transparansi atribusi sumber (*Source Verification Box*) dan skor kredibilitas.
   - Kotak rujukan riset ilmiah (*Peer-Reviewed Study*) dan perenungan hikmah/dalil kontekstual.
3. **Desain Swiss Minimalist (UI UX Pro Max)**:
   - Tipografi editorial berbobot, ramah mobile, kontras tinggi WCAG.
   - Tata letak stabil (*Zero Cumulative Layout Shift / CLS < 0.1*).
4. **Google AdSense Ready**:
   - Wadah iklan responsif dengan rasio aspek tereservasi (*anti-CLS*).
   - Terintegrasi dengan root domain `pdfumi.com`.
5. **Jadwal Publikasi Otomatis (Scheduler)**:
   - Terbagi dalam 3 slot emas pembaca:
     - **Morning Briefing** (07:00 WIB / 09:00 JST)
     - **Lunchtime Digest** (12:00 WIB / 14:00 JST)
     - **Evening Deep Dive** (19:00 WIB / 21:00 JST)
   - Webhook API endpoint: `GET /api/cron/publish?key=CRON_SECRET`.
6. **SEO & Google News Ready**:
   - Otomatis menghasilkan sitemap XML (`/sitemap.xml`) dan `robots.txt`.
   - Schema JSON-LD `NewsArticle` terstruktur di setiap artikel.

---

## 🏛️ Arsitektur Sistem (Clean Architecture & SOLID)

```
pdfumi-news/
├── src/
│   ├── domain/                  # Enterprise Business Rules (Independent of Frameworks)
│   │   ├── entities/            # Article, SourceReference, ResearchCitation, Categories
│   │   └── repositories/        # IArticleRepository interface
│   ├── application/             # Application Business Rules (Use Cases)
│   │   └── use-cases/           # GetNewsUseCase, PublishSchedulerUseCase
│   ├── infrastructure/          # Interface Adapters & External Frameworks
│   │   ├── data/                # Seed articles & JSON storage
│   │   └── repositories/        # JsonArticleRepository (implementing IArticleRepository)
│   ├── i18n/                    # Routing, detection, and navigation for id, en, ja
│   ├── components/              # UI UX Pro Max reusable components
│   └── app/                     # Next.js 16.4.6 App Router & API routes
│       ├── [locale]/            # Dynamic locale routing
│       │   ├── page.tsx         # Homepage
│       │   ├── [category]/      # Category archives
│       │   └── article/[slug]/  # Article Reader + JSON-LD
│       ├── api/cron/publish/    # Scheduled publishing webhook
│       ├── sitemap.ts           # Google News & standard sitemap
│       ├── robots.ts
│       └── proxy.ts             # Next.js 16 Proxy Middleware
├── messages/                    # Translations (id.json, en.json, ja.json)
├── deploy/                      # Nginx reverse proxy configuration
├── Dockerfile                   # Multi-stage standalone build
└── docker-compose.yml           # VPS container deployment (Port 3008)
```

---

## 🚀 Menjalankan Secara Lokal (Development)

```bash
cd pdfumi-news
npm install
npm run dev
```

Buka peramban di:
- **Indonesia**: [http://localhost:3008/id](http://localhost:3008/id)
- **English**: [http://localhost:3008/en](http://localhost:3008/en)
- **日本語**: [http://localhost:3008/ja](http://localhost:3008/ja)

Untuk build produksi:
```bash
npm run build
npm start
```

---

## 🌐 Panduan Deployment ke VPS (`43.134.26.73`)

Sesuai dengan *End-to-End VPS Deployment Guide*:

### 1. Salin Proyek ke VPS
```bash
# Dari komputer lokal
rsync -avz --exclude 'node_modules' --exclude '.next' ./pdfumi-news ubuntu@43.134.26.73:/var/www/
```

### 2. Jalankan Container Docker di VPS
```bash
ssh ubuntu@43.134.26.73
cd /var/www/pdfumi-news
docker compose up -d --build
```

Container berjalan di port internal `127.0.0.1:3008`.

### 3. Konfigurasi Nginx di VPS Host
Salin konfigurasi Nginx:
```bash
sudo cp /var/www/pdfumi-news/deploy/news.pdfumi.com.conf /etc/nginx/sites-available/news.pdfumi.com
sudo ln -s /etc/nginx/sites-available/news.pdfumi.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Pasang Sertifikat SSL (Let's Encrypt Certbot)
*Pastikan DNS record A `news.pdfumi.com` sudah diarahkan ke IP `43.134.26.73` terlebih dahulu di Cloudflare / registrar domain Anda:*
```bash
sudo certbot --nginx -d news.pdfumi.com
```

### 5. Setup Cron Job Scheduler di VPS
Jadwalkan eksekusi publikasi otomatis setiap jam:
```bash
# Buka crontab
crontab -e

# Tambahkan baris ini (mengecek setiap jam di menit ke-0):
0 * * * * curl -s "http://127.0.0.1:3008/api/cron/publish?key=pdfumi-news-secure-cron-2026" > /dev/null 2>&1
```
