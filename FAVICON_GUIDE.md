# คู่มือการเปลี่ยน Favicon และ Metadata

## ไฟล์ที่ต้องมีใน `/public/`

### ไฟล์หลัก
- `favicon.ico` - Favicon หลัก (32x32)
- `favicon.svg` - SVG favicon สำหรับ modern browsers
- `apple-touch-icon.png` - สำหรับ iOS (180x180)
- `site.webmanifest` - PWA manifest

### ไฟล์เพิ่มเติม (ไม่บังคับ)
- `favicon-16x16.png` - 16x16 PNG
- `favicon-32x32.png` - 32x32 PNG
- `android-chrome-192x192.png` - Android icon
- `android-chrome-512x512.png` - Android icon
- `safari-pinned-tab.svg` - Safari pinned tab
- `og-image.png` - Open Graph image (1200x630)

## วิธีสร้าง Favicon

### 1. ใช้ Online Tools
- [Favicon.io](https://favicon.io/) - สร้าง favicon จากรูปภาพ
- [RealFaviconGenerator](https://realfavicongenerator.net/) - สร้าง favicon แบบครบชุด

### 2. สร้างเองด้วย SVG
ไฟล์ `favicon.svg` ที่สร้างไว้แล้วมี:
- Gradient background (สีม่วง-ชมพู)
- ตัวอักษร "FB" (FakBok)
- Decorative dots
- Responsive design

### 3. แปลง SVG เป็น PNG
```bash
# ใช้ ImageMagick
convert favicon.svg -resize 32x32 favicon-32x32.png
convert favicon.svg -resize 16x16 favicon-16x16.png
convert favicon.svg -resize 180x180 apple-touch-icon.png
```

## การตั้งค่า Metadata

### 1. SEO Metadata
- Title: "FakBok - ฝากบอก"
- Description: "แอปพลิเคชันโซเชียลมีเดียสไตล์ TikTok สำหรับนักเรียน"
- Keywords: ["โซเชียลมีเดีย", "นักเรียน", "โพสต์", "แชร์", "คอมเม้น"]

### 2. Open Graph (Facebook, Line)
- Title และ Description สำหรับแชร์
- Image: `/og-image.png`
- URL: โดเมนของคุณ

### 3. Twitter Card
- Card type: `summary_large_image`
- Title และ Description
- Image: `/og-image.png`

### 4. PWA Support
- Manifest file: `/site.webmanifest`
- Theme color: `#6366f1`
- Display mode: `standalone`

## การทดสอบ

### 1. Local Testing
```bash
npm run dev
```
เปิด browser และดู favicon ใน tab

### 2. Production Testing
- Deploy ไป Vercel
- ตรวจสอบ favicon ใน browser
- ทดสอบแชร์ใน Facebook, Line, Twitter

### 3. PWA Testing
- เปิด Chrome DevTools
- ไปที่ Application tab
- ตรวจสอบ Manifest

## การแก้ไขปัญหา

### Favicon ไม่แสดง
1. ตรวจสอบ path ใน `layout.js`
2. Clear browser cache
3. ตรวจสอบไฟล์ใน `/public/`

### Metadata ไม่ทำงาน
1. ตรวจสอบ `metadataBase` URL
2. เปลี่ยน `your-domain.vercel.app` เป็นโดเมนจริง
3. ทดสอบด้วย [Facebook Debugger](https://developers.facebook.com/tools/debug/)

### PWA ไม่ทำงาน
1. ตรวจสอบ `site.webmanifest`
2. ตรวจสอบ icon paths
3. ทดสอบใน Chrome DevTools

## ตัวอย่างการใช้งาน

### เปลี่ยน Favicon
1. แทนที่ไฟล์ใน `/public/`
2. รัน `npm run build`
3. Deploy ใหม่

### เปลี่ยน Metadata
1. แก้ไข `src/app/layout.js`
2. เปลี่ยน title, description
3. อัปเดต og-image

### เพิ่ม PWA Features
1. แก้ไข `site.webmanifest`
2. เพิ่ม service worker (ถ้าต้องการ)
3. ทดสอบ PWA installation 