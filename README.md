ฝึกงาน interner  ออมสินน 


เฟรมเวิร์คหลัก
Next.js 15.1.7 
React 19.0.0
pnpm 10.4.1
node 22.14.0


ในไฟล์ .env
เชื่อม database

DATABASE_URL="postgresql://postgres:1234@localhost:5432/form_project"


คำสั่งเริ่มต้น ใช้งาน 
pnpm run build && pnpm run start

npx prisma migrate deploy
npx prisma generate

insert option
# รัน SQL script ใน option.sql 




