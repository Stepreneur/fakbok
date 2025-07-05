# Deployment Guide

## Vercel Deployment

### 1. Environment Variables
ตั้งค่า Environment Variables ใน Vercel:

```
DATABASE_URL=your_database_connection_string
```

### 2. Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (จะรัน `prisma generate` อัตโนมัติ)
- **Install Command**: `npm install` (จะรัน `prisma generate` อัตโนมัติ)

### 3. Database Setup
#### Option A: Railway
1. สร้าง MySQL database ใน Railway
2. Copy connection string
3. ตั้งค่าใน Vercel Environment Variables

#### Option B: PlanetScale
1. สร้าง MySQL database ใน PlanetScale
2. Copy connection string
3. ตั้งค่าใน Vercel Environment Variables

#### Option C: Supabase
1. สร้าง PostgreSQL database ใน Supabase
2. Copy connection string
3. ตั้งค่าใน Vercel Environment Variables

### 4. File Upload
สำหรับ production ควรใช้:
- **Vercel Blob Storage**
- **AWS S3**
- **Cloudinary**

### 5. Troubleshooting

#### Prisma Error
```bash
# รันใน local ก่อน deploy
npx prisma generate
npx prisma db push
```

#### Build Error
ตรวจสอบ:
1. Environment Variables ถูกต้อง
2. Database connection string ถูกต้อง
3. Prisma schema sync กับ database

### 6. Local Testing
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run development server
npm run dev
```

### 7. Production Checklist
- [ ] Environment Variables ตั้งค่าแล้ว
- [ ] Database connection ทำงาน
- [ ] File upload system ทำงาน
- [ ] API routes ทำงาน
- [ ] Prisma client generate แล้ว 