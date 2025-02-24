# 🖥️ UI Testing with Playwright

## ✨ Overview

ทดสอบ UI ของเว็บ **Saucedemo** สำหรับ **ค้นหา**, **เพิ่มสินค้าในตะกร้า**, **ลบสินค้า**, **กรอกข้อมูลลูกค้า**, และ **สรุปยอดคำสั่งซื้อ** ด้วย **Playwright** 🛒🛍️

## 📦 Setup

ติดตั้ง dependencies:

```
npm install
```

## 🚀 Run Tests

```
npx playwright test
```

## 🔗 Test Cases

-   **TC-001** 🔍 ค้นหาสินค้าและเพิ่มลงตะกร้า
    
-   **TC-002** ❌ ลบสินค้า Backpack ออกจากตะกร้า
    
-   **TC-003** 📝 กรอกข้อมูลลูกค้า
    
-   **TC-004** 💰 ตรวจสอบราคาสินค้าและภาษี
    
-   **TC-005** ✅ ดำเนินการสั่งซื้อสำเร็จ
    

## 📊 Reporting

```
npx playwright test --reporter=html
```

ดูรายงานใน `playwright-report/` 📂

## 🏆 Happy Testing! 🚀
