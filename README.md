# 🧪 Discord Bot Command Template

> A clean and extensible Discord.js v14 bot command framework using modular handlers for slash commands, buttons, select menus, and modals.
> เทมเพลตบอท Discord พร้อมระบบจัดการ interaction อย่างยืดหยุ่น รองรับคำสั่ง สแลช ปุ่ม เมนู และโมดอล

---

## 📁 โครงสร้างโปรเจกต์ | Project Structure

```
.
├── commands/               # ไฟล์คำสั่งต่าง ๆ (เช่น test.js)
├── lib/                    # ยูทิลิตี้ (เช่น RegisID, deploy, clean)
├── index.js                # ไฟล์หลักรันบอทและจัดการ interaction
├── .env                    # ตัวแปรลับ เช่น token, guild ID
└── package.json
```

---

## ⚙️ วิธีติดตั้ง | Setup

### 1. ติดตั้ง Node.js และ clone โปรเจกต์

```bash
git clone <repository-url>
cd templace_discordbot_commands
npm install
```

### 2. สร้าง `.env`

```env
DISCORD_TOKEN=YOUR_BOT_TOKEN
DISCORD_CLIENT_ID=YOUR_CLIENT_ID
DISCORD_OWNER_GUILD=YOUR_OWNER_GUILD_ID
```

### 3. รันบอท

```bash
node index.js
```

---

## 📦 ฟีเจอร์หลัก | Features

- ✅ โหลดคำสั่งแบบแยกไฟล์อัตโนมัติ (`/commands`)
- ✅ ระบบ `allowedGuilds` จำกัดการใช้คำสั่ง (เช่น `['env']`, `['*']`)
- ✅ รองรับ interaction หลัก:
  - `executeChatInput` (slash command)
  - `executeSelectMenu` (select menu)
  - `executeButton` (ปุ่ม)
  - `executeModal` (โมดอล)
- ✅ ระบบ `RegisID` & `parseCustomData` สำหรับแนบข้อมูล custom_id

---

## 🛠️ ตัวอย่างคำสั่ง /test

ไฟล์ `commands/test.js` แสดงตัวอย่างการใช้งาน interaction หลายรูปแบบในคำสั่งเดียว:  
ส่ง select menu + ปุ่ม และแสดง modal ตามการเลือก

```js
allowedGuilds: ['env'], // ใช้ใน guild ที่ระบุใน .env
custom_id: 'test',      // ใช้เป็น prefix ใน interaction handler

async executeChatInput(interaction) {
  // สร้าง select menu + ปุ่ม และตอบกลับ
}
```

---

## 🧠 ระบบ allowedGuilds

ในแต่ละ command สามารถกำหนด `allowedGuilds`:

- `['*']` = ใช้ได้ทุกกิลด์ที่บอทอยู่
- `['env']` = เฉพาะกิลด์ใน ENV (DISCORD_OWNER_GUILD)
- `[ '123456789012345678' ]` = ใส่ ID ตรง ๆ ได้

ฟังก์ชัน `isAllowedToUseCommand(guildId, allowedGuilds)` ตรวจสอบสิทธิ์ก่อน execute

---

## 🧹 Clean & Deploy

- `lib/cleanCommands.js` → ลบคำสั่งที่ไม่ใช้งานจากทุกกิลด์ที่บอทอยู่
- `lib/deployToGuild.js` → deploy คำสั่งเฉพาะที่อนุญาตในแต่ละกิลด์

เมื่อ `ClientReady` จะ:
1. เรียก `cleanCommands()` เพื่อเคลียร์ของเก่า
2. เรียก `deployToGuild()` สำหรับ guild ใน ENV

---

## ✅ LICENSE

MIT