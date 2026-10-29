# Money Note — บันทึกรายรับรายจ่าย (IG342 Week 7: App with Local Storage)

แอปบันทึกรายรับ-รายจ่ายที่จำข้อมูลไว้ใน **Local Storage** ของเบราว์เซอร์
ปิดแท็บ / รีเฟรช / ปิดเครื่องแล้วเปิดใหม่ ข้อมูลยังอยู่ครบ

## วิธีรัน

```bash
npm install
npm run dev
```

แล้วเปิด http://localhost:5173

## ฟีเจอร์
- เพิ่มรายการ รายรับ / รายจ่าย พร้อมหมวดหมู่
- สรุปยอดคงเหลือ รายรับรวม รายจ่ายรวม อัตโนมัติ
- กรองดูเฉพาะรายรับ / รายจ่าย
- ลบทีละรายการ หรือล้างทั้งหมด

## หลักการ Load / Save (อยู่ใน `src/App.jsx`)

| ขั้นตอน | คำสั่ง | ทำเมื่อไหร่ |
|---|---|---|
| **Load** | `localStorage.getItem("transactions")` แล้ว `JSON.parse` | ครั้งแรกที่เปิดแอป (ค่าเริ่มต้นของ `useState`) |
| **Save** | `localStorage.setItem("transactions", JSON.stringify(transactions))` | ทุกครั้งที่ `transactions` เปลี่ยน (ใน `useEffect`) |

> Local Storage เก็บได้เฉพาะข้อความ (string) จึงต้องแปลง array เป็น JSON ก่อนบันทึก และแปลงกลับตอนโหลด

## ดูข้อมูลที่บันทึกไว้
กด F12 → แท็บ **Application** → **Local Storage** → `http://localhost:5173` → key `transactions`

## เทคโนโลยี
React + Vite (SWC) + Tailwind CSS v3
