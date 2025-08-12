require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
  Client,
  Collection,
  GatewayIntentBits,
  Events
} = require('discord.js');

const { deployToGuild } = require('./lib/deployToGuild');
const { cleanCommands } = require('./lib/cleanCommands');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
client.selects = new Collection();
client.bottons = new Collection();
client.modals = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  if (command.data) {
    client.commands.set(command.data.name, command);
  }

  if (command.custom_id && command.executeSelectMenu) {
    client.selects.set(command.custom_id, command);
  }

  if (command.custom_id && command.executeButton) {
    const key = command.custom_id || command.data?.name;
    client.bottons.set(key, command);
  }

  if (command.custom_id && command.executeModal) {
    const key = command.custom_id || command.data?.name;
    client.modals.set(key, command);
  }
}

async function deployAllAllowedGuilds() {
  const jsonGuilds = getAllGuildIds();
  const envGuild = process.env.DISCORD_OWNER_GUILD;
  const uniqueGuilds = new Set([...jsonGuilds, envGuild]);
  console.log(`🚀 กำลัง deploy คำสั่งให้ทั้งหมด ${uniqueGuilds.size} เซิร์ฟเวอร์...`);
  for (const guildId of uniqueGuilds) {
    if (!guildId) continue;
    try {
      await deployToGuild(guildId);
    } catch (err) {
      console.error(`❌ Deploy ล้มเหลวสำหรับ guild ${guildId}:`, err);
      appendDeployLog({
        guildId,
        source: store.isAllowedGuild(guildId) ? 'json' : 'env',
        success: true,
      });
    }
  }
}

client.once(Events.ClientReady, async () => {
  console.log(`✅ บอทพร้อมใช้งานในชื่อ ${client.user.tag}`);
  await cleanCommands(client).then(() => deployAllAllowedGuilds());
});

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      const allowed = isAllowedToUseCommand(interaction.guildId, command.allowedGuilds);
      if (!allowed) {
        return interaction.reply({
          content: 'คำสั่งนี้ไม่สามารถใช้งานได้ในเซิร์ฟเวอร์นี้',
          ephemeral: true
        });
      }
      return await command.executeChatInput(interaction);
    } else if (interaction.isStringSelectMenu()) {

      const components = interaction.message.components.map(row => {
        return {
          ...row.toJSON(),
          components: row.components.map(c => {
            if (c.data?.type === 3) { // 3 = StringSelectMenu
              return {
                ...c.data,
                default_values: [] // ล้างค่าที่เลือก
              };
            }
            return c.data;
          })
        };
      });

      await interaction.message.edit({ components });

      const prefix = interaction.customId.split('_')[0];
      const select = client.selects.get(prefix);
      if (!select && select.executeSelectMenu) {
        return interaction.reply({
          content: 'การกระทำไม่ทำงาน',
          ephemeral: true
        });
      };
      return await select.executeSelectMenu(interaction);
    } else if (interaction.isModalSubmit()) {
      const prefix = interaction.customId.split('_')[0];
      const modal = client.modals.get(prefix);
      if (!modal && modal.executeModal) {
        return interaction.reply({
          content: 'การกระทำไม่ทำงาน',
          ephemeral: true
        });
      };
      await modal.executeModal(interaction);
    } else if (interaction.isButton()) {
      const prefix = interaction.customId.split('_')[0];
      const botton = client.bottons.get(prefix);
      if (!botton && botton.executeButton) {
        return interaction.reply({
          content: 'การกระทำไม่ทำงาน',
          ephemeral: true
        });
      };
      await botton.executeButton(interaction);
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการตอบโต้:', error);

    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply({
          content: '⚠️ เกิดข้อผิดพลาดในการดำเนินการ กรุณาลองใหม่อีกครั้ง',
          ephemeral: true
        });
      } catch (e) {
        console.error('❌ ส่งข้อความตอบกลับไม่สำเร็จ:', e);
      }
    }
  }
});


function isAllowedToUseCommand(guildId, allowedGuilds = []) {
  if (allowedGuilds.includes(guildId)) return true;
  if (allowedGuilds.includes('env') && guildId === process.env.DISCORD_OWNER_GUILD) return true;
  if (allowedGuilds.includes('json') && store.isAllowedGuild(guildId)) return true;
  return false;
}

client.login(process.env.DISCORD_TOKEN);
