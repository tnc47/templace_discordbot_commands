const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { RegisID , parseCustomData} = require('../lib/customID');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test interaction showcase')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  allowedGuilds: ['env'],
  custom_id: 'test',

  async executeChatInput(interaction) {
    const select = new StringSelectMenuBuilder()
      .setCustomId(RegisID('test', 'select', ['sendID', 'modalID']))
      .setPlaceholder('Choose an option!')
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel('OPEN MODAL').setValue('modalID'),
        new StringSelectMenuOptionBuilder().setLabel('SEND_MESSAGE').setValue('sendID'),
      );

    const buttonOpen = new ButtonBuilder()
      .setCustomId(RegisID('test', 'button', ['modalID']))
      .setLabel('OPEN MODAL')
      .setStyle(ButtonStyle.Primary);

    const buttonSend = new ButtonBuilder()
      .setCustomId(RegisID('test', 'button', ['sendID']))
      .setLabel('SEND_MESSAGE')
      .setStyle(ButtonStyle.Secondary);

    await interaction.reply({
      content: '🧪 Testing interaction components!',
      components: [
        new ActionRowBuilder().addComponents(select),
        new ActionRowBuilder().addComponents(buttonOpen),
        new ActionRowBuilder().addComponents(buttonSend),
      ],
    });
  },

  async executeSelectMenu(interaction) {
    const data = parseCustomData(interaction.customId); // ['sendID','modalID']
    const chosen = interaction.values?.[0];             // 'modalID' หรือ 'sendID'

    if (!chosen || !data.includes(chosen)) {
      return interaction.reply({ content: 'ค่าที่เลือกไม่ถูกต้อง', ephemeral: true });
    }

    switch (chosen) {
      case 'modalID': {
        const modal = new ModalBuilder()
          .setCustomId(RegisID('test', 'modal', ['modalID']))
          .setTitle('Testing Modal');

        const input = new TextInputBuilder()
          .setCustomId('modal_input')
          .setLabel('Type something...')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(input));
        return interaction.showModal(modal);
      }

      case 'sendID': {
        return interaction.reply({
          content: `คุณเลือก: \`${chosen}\``,
          ephemeral: true,
        });
      }

      default:
        return interaction.reply({ content: 'ไม่พบ action สำหรับตัวเลือกนี้', ephemeral: true });
    }
  },

  async executeButton(interaction) {
    try {
      const data = parseCustomData(interaction.customId); // เช่น ['modalID'] หรือ ['sendID']
      const action = data[0];

      switch (action) {
        case 'modalID': {
          const modal = new ModalBuilder()
            .setCustomId(RegisID('test', 'modal', ['modalID'])) // ใช้ 'modal' เพื่อ route ไป executeModal
            .setTitle('Testing Modal');

          const input = new TextInputBuilder()
            .setCustomId('modal_input')
            .setLabel('Type something...')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(new ActionRowBuilder().addComponents(input));
          return interaction.showModal(modal);
        }

        case 'sendID':
          return interaction.reply({ content: 'คุณกดปุ่ม: `sendID`', ephemeral: true });

        default:
          return interaction.reply({ content: 'ไม่พบ action ที่รองรับสำหรับปุ่มนี้', ephemeral: true });
      }
    } catch (err) {
      console.error('executeButton error:', err);
      if (!interaction.replied && !interaction.deferred) {
        return interaction.reply({ content: 'เกิดข้อผิดพลาด', ephemeral: true });
      }
    }
  },

  async executeModal(interaction) {
    const data = parseCustomData(interaction.customId); // ex: ['modalID']
    const inputVal = interaction.fields.getTextInputValue('modal_input');

    console.log('Modal Data:', data);
    console.log('Modal Input:', inputVal);

    return interaction.reply({
      content: `คุณพิมพ์ว่า: \`${inputVal}\``,
      ephemeral: true,
    });
  },
};
