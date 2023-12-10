const Discord = require("discord.js");
const BaseEmbed = require('../Utils/BaseEmbed.js')
const ms = require('ms');
const Users = require('../models/user.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    try {
      if (message.author.bot) return;
      if (message.guild.id !== process.env.guildId) return;
      if (!message.member.permissions.has('Administrator')) return;
      let lol = Math.floor(Math.random() * 20) + 1;
      let claimId = '';
      if (lol == 20) {
        const embed = BaseEmbed()
        .setDescription(`A snowball dropped <:snowball:1182334321214890064>`)

        let row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('snowball')
          .setEmoji('<:snowball:1182334321214890064>')
          .setStyle(Discord.ButtonStyle.Secondary),
        )

        let msg = await message.channel.send({ embeds: [embed], components: [row] })
        const col = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 180000 })
        col.on('collect', async (b) => {
          await b.deferUpdate();
          if (b.customId == 'snowball') {
            if (claimId == msg.id) return;
            claimId = msg.id;
            col.stop();
            const profile = await Users.findOne({ userId: b.user.id, guildId: b.guild.id });
            if (!profile) {
              profile = await new Users({
                userId: b.user.id,
                guildId: b.guild.id
              })
            }
            await Users.findOneAndUpdate(
              { userId: b.user.id, guildId: b.guild.id }, 
              { $inc: { snowballs: 100 } }
            )
            row = new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
              .setCustomId('snowball')
              .setEmoji('<:snowball:1182334321214890064>')
              .setDisabled(true)
              .setStyle(Discord.ButtonStyle.Secondary),
            )
            embed.setFooter({ text: `Claimed by ${b.user.username}`, iconURL: b.user.displayAvatarURL() })
            await msg.edit({ embeds: [embed], components: [row] })
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
};
