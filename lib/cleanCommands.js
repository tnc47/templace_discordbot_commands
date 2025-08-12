const { REST, Routes } = require('discord.js');
require('dotenv').config();
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const clientId = process.env.DISCORD_CLIENT_ID;

async function cleanCommands(client) {
    try {
        console.log('เริ่มตรวจสอบและล้างคำสั่งที่ไม่ได้ใช้งานแล้ว...');

        const currentCommandNames = client.commands.map(cmd => cmd.data.name);
        const guilds = client.guilds.cache.map(guild => guild.id);

        for (const guildId of guilds) {
            const existing = await rest.get(Routes.applicationGuildCommands(clientId, guildId));

            const toDelete = existing.filter(cmd => !currentCommandNames.includes(cmd.name));
            if (toDelete.length === 0) {
                console.log(`ไม่มีคำสั่งที่ต้องลบใน guild ${guildId}`);
                continue;
            }

            for (const cmd of toDelete) {
                await rest.delete(Routes.applicationGuildCommand(clientId, guildId, cmd.id));
                console.log(`🗑️ ลบคำสั่ง ${cmd.name} (${cmd.id}) จาก guild ${guildId}`);
            }
        }

        console.log('ลบคำสั่งที่ไม่ตรงกับระบบปัจจุบันเสร็จสมบูรณ์');
    } catch (err) {
        console.error('เกิดข้อผิดพลาดขณะล้างคำสั่ง:', err);
    }
}

async function cleanCommandsguildId(guildId) {
    try {
        console.log(`กำลังลบคำสั่งใน guild: ${guildId}...`);

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });

        console.log(`ลบคำสั่งของ guild ${guildId} สำเร็จ`);
    } catch (err) {
        console.error(`ลบคำสั่งของ guild ${guildId} ล้มเหลว:`, err);
    }
}


module.exports = { cleanCommands, cleanCommandsguildId };
