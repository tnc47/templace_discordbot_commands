# 🧪 Discord Bot Command Template

> ✅ A clean Discord.js v14 command template supporting slash commands, select menus, buttons, modals, and dynamic interaction handling  
> ✅ เทมเพลตคำสั่ง Discord.js v14 พร้อมรองรับ Slash Command, Select Menu, ปุ่ม, โมดอล และการจัดการปฏิสัมพันธ์แบบยืดหยุ่น

---

## 📁 Project Structure | โครงสร้างโปรเจกต์

```
.
├── commands/               # คำสั่ง (เช่น test.js)
├── lib/                    # ยูทิลิตี้ (เช่น RegisID, deploy, clean)
├── index.js                # เริ่มต้นบอทและจัดการ interaction
├── .env                    # ตัวแปรลับ
└── package.json
```

---

## ⚙️ Requirements | ข้อกำหนด

- Node.js 18 ขึ้นไป
- สร้าง Discord Bot ที่ [Discord Developer Portal](https://discord.com/developers/applications)
- สิทธิ์ `applications.commands`, `bot`, และ `Guild` intents

---

## 🚀 Setup | ติดตั้ง

### 1. Clone Project
```bash
git clone https://github.com/tnc47/templace_discordbot_commands.git
cd templace_discordbot_commands
npm install
```

### 2. สร้างไฟล์ `.env`
```env
DISCORD_TOKEN=ใส่โทเคนบอท
DISCORD_CLIENT_ID=ใส่ Application ID
DISCORD_OWNER_GUILD=ใส่ Guild ID ของกิลด์เจ้าของ
```

### 3. Run the bot
```bash
node index.js
```

---

## 🧠 How It Works | วิธีการทำงาน

- โหลดคำสั่งจาก `./commands/` แล้วเก็บไว้ใน `client.commands`, `client.selects`, `client.bottons`, `client.modals`
- ใน `ClientReady`:
  - เคลียร์คำสั่งเก่าในกิลด์ (`cleanCommands`)
  - Deploy คำสั่งใหม่ให้เฉพาะกิลด์ที่อนุญาต (`deployToGuild`)
- ทุก `interaction` ที่เกิดขึ้นจะ route ไปยังฟังก์ชันที่เกี่ยวข้อง

---

## 🧾 Allowed Guilds | การจำกัดกิลด์ที่ใช้คำสั่ง

ในแต่ละไฟล์คำสั่ง เช่น `test.js`:

```js
allowedGuilds: ['env']
```

- `'env'` = ใช้ได้เฉพาะในกิลด์ที่กำหนดใน `.env` (`DISCORD_OWNER_GUILD`)
- `'json'` = (สำหรับกรณีที่ใช้ระบบจัดเก็บ guild ภายนอก เช่นในไฟล์)
- `['1234567890']` = ใส่ ID ตรง ๆ ได้เลย

---

## 🧩 RegisID & Custom Data System

ฟังก์ชันใน `lib/customID.js`:

```js
RegisID('prefix', 'type', ['data']) 
// ตัวอย่าง: test_select-["modalID"]

parseCustomData(customId)
// คืนค่า array ข้อมูลที่อยู่ใน custom_id
```

> ใช้เพื่อแนบข้อมูลแบบ dynamic ใน interaction ต่าง ๆ เช่น select menu, button, modal

---

## 💡 Example Command: `/test`

> รองรับทุก interaction (select, button, modal) พร้อมระบบแนบข้อมูล

(เนื้อหาโค้ดย่อไว้ใน README ฉบับเต็มแล้ว)

---

## 🧹 Cleaning Commands (Auto)
> ระบบจะลบคำสั่งเก่าที่ไม่ได้ใช้ในแต่ละ guild โดยอัตโนมัติ

```js
cleanCommands(client);
```

ใช้ `client.commands` เปรียบเทียบกับคำสั่งที่ deploy ไว้

---

## 🚀 Deploying Commands
> Deploy คำสั่งเฉพาะให้ guild ที่ได้รับอนุญาต

```js
deployToGuild(guildId)
```

ตรวจสอบ `allowedGuilds` ของแต่ละ command ก่อน push ไปยัง Discord API

---

## 🧪 Testing

- ✅ ทดสอบคำสั่ง `/test`
- ✅ ตรวจสอบ select menu, button, modal ทำงานครบ
- ✅ ตรวจสอบสิทธิ์เฉพาะ guild เจ้าของ
- ✅ ล้างค่าที่เลือกของ select หลัง interaction (มีใน `index.js`)

---

## ✅ เหมาะสำหรับ

- ผู้พัฒนาที่ต้องการระบบ interaction handler แบบแยกไฟล์
- การทำระบบ dynamic ID และแนบข้อมูลใน interaction
- Template สำหรับโปรเจกต์ Discord bot ขนาดเล็ก-กลาง

---

## 📄 License

MIT

---