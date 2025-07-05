# FakBok - Social Media Platform

แอปพลิเคชันโซเชียลมีเดียสไตล์ TikTok สำหรับนักเรียน

## ฟีเจอร์หลัก

### 🎯 ระบบโพสต์แบบ Real-time
- **โพสต์แบบ Manual**: ผู้ใช้สามารถสร้างโพสต์พร้อมรูปภาพและเลือกชั้นที่เกี่ยวข้อง
- **กรองโพสต์ 24 ชั่วโมง**: แสดงเฉพาะโพสต์ที่สร้างใน 24 ชั่วโมงที่ผ่านมา
- **แสดงเวลาที่โพสต์**: แต่ละโพสต์จะแสดงเวลาที่โพสต์มาแล้ว (ชั่วโมง/นาที)

### 📱 Infinite Scroll
- **โหลดครั้งแรก**: ดึงโพสต์มา 10 รายการแรก
- **โหลดเพิ่มอัตโนมัติ**: เมื่อเลื่อนไปถึงโพสต์ที่ 10 จะโหลดเพิ่มอีก 10 รายการ
- **Loading Indicator**: แสดงสถานะการโหลดข้อมูล

### 🎨 UI/UX ที่สวยงาม
- **TikTok-style Interface**: หน้าจอแบบเต็มหน้าจอพร้อม swipe gesture
- **Animated Background**: พื้นหลังแบบ gradient พร้อม particle effects
- **Smooth Animations**: การเปลี่ยนโพสต์แบบ smooth ด้วย Framer Motion
- **Responsive Design**: รองรับทุกขนาดหน้าจอ

## การติดตั้ง

1. **Clone โปรเจค**
```bash
git clone <repository-url>
cd fakbok
```

2. **ติดตั้ง Dependencies**
```bash
npm install
```

3. **ตั้งค่า Database**
```bash
# สร้างไฟล์ .env และใส่ DATABASE_URL
cp .env.example .env

# รัน Prisma migration
npx prisma migrate dev
```

4. **รัน Development Server**
```bash
npm run dev
```

## การใช้งาน

### การสร้างโพสต์
1. คลิกปุ่ม "+" ที่มุมขวาล่าง
2. พิมพ์ข้อความ (สูงสุด 500 ตัวอักษร)
3. เลือกรูปภาพ (ไม่บังคับ)
4. เลือกชั้นที่เกี่ยวข้อง (ไม่บังคับ)
5. กด "ส่งโพสต์"

### การดูโพสต์
- **Swipe Up**: ดูโพสต์ถัดไป
- **Swipe Down**: ดูโพสต์ก่อนหน้า
- **Infinite Scroll**: โพสต์จะโหลดเพิ่มอัตโนมัติเมื่อเลื่อนไปถึงท้าย

## เทคโนโลยีที่ใช้

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **File Upload**: Local file system
- **Icons**: Lucide React

## โครงสร้างโปรเจค

```
fakbok/
├── src/
│   ├── app/
│   │   ├── api/posts/route.js    # API สำหรับโพสต์
│   │   ├── page.js               # หน้าหลัก
│   │   └── layout.js
│   └── components/
│       └── Create/page.js        # Component สร้างโพสต์
├── prisma/
│   └── schema.prisma             # Database schema
└── public/upload/                # โฟลเดอร์เก็บรูปภาพ
```

## API Endpoints

### GET /api/posts
ดึงโพสต์แบบ pagination
- `page`: หน้าปัจจุบัน (default: 1)
- `limit`: จำนวนโพสต์ต่อหน้า (default: 10)

### POST /api/posts
สร้างโพสต์ใหม่
- `content`: เนื้อหาโพสต์
- `tag`: ชั้นที่เกี่ยวข้อง
- `image`: รูปภาพ (optional)

## การพัฒนาเพิ่มเติม

- [ ] ระบบ Authentication
- [ ] ระบบ Like/Comment
- [ ] ระบบ Share
- [ ] Push Notifications
- [ ] Real-time Updates
- [ ] User Profiles
