const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const clientId = process.env.DISCORD_CLIENT_ID;
const token = process.env.DISCORD_TOKEN;

const rest = new REST({ version: '10' }).setToken(token);

// deploy เฉพาะคำสั่งที่ guild นี้อนุญาต (จาก allowedGuilds)
async function deployToGuild(guildId) {
    const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
    const commands = [];


    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);

        if (
            command.allowedGuilds &&
            (
                command.allowedGuilds.includes(guildId) ||
                (command.allowedGuilds.includes('env') && guildId === process.env.DISCORD_OWNER_GUILD) ||
                (command.allowedGuilds.includes('json'))
            )
        ) {
            commands.push(command.data.toJSON());
        }
    }

    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
        console.log(`✅ คำสั่งถูกจำนวน ${JSON.stringify(commands.map((a) => a.name))} deploy ไปยัง guild: ${guildId}`);
    } catch (error) {
        console.error(`❌ เกิดข้อผิดพลาดขณะ deploy ไปยัง ${guildId}:`, error);
    }
}

module.exports = { deployToGuild };
