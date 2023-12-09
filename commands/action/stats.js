const { SlashCommandBuilder } = require('@discordjs/builders');
const BaseEmbed = require('../../Utils/BaseEmbed.js');
const Profile = require('../../models/user.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Displays stats of a user.')
    .addUserOption(option => option.setName('target').setDescription('Select a user')),
  async execute(i) {
    try {
      let user = i.options.getUser('target') || i.user;
      let stats = await Profile.findOne({ userId: user.id, guildId: i.guild.id })
      if (!stats) {
        await i.reply(`**${user.username}** has no snowman.`)
      } else {
        let man = stats.snowman.height ?? 0;
        let shield = stats.inventory.snowShield;
        let magnet = stats.inventory.snowMagnet;
        let multiThrow = stats.inventory.multiThrow;
        console.log(multiThrow)
        let wallLvl = stats.snowWall.level;
        let wallHealth = stats.snowWall.health ?? '0';
        
        if (!shield) {
          shield = 'Not Active'
        } else {
          if (Date.now() > shield) {
            shield = 'Not Active'
          } else {
            time = ms(shield - Date.now());
            shield = `Active for next ${time}`
          }
        }

        if (!magnet) {
          magnet = 'Not Active'
        } else {
          if (Date.now() > magnet) {
            magnet = 'Not Active'
          } else {
            time = ms(magnet - Date.now());
            magnet = `Active for next ${time}`
          }
        }

        if (!multiThrow) {
          multiThrow = 'Not Active'
        } else {
          if (Date.now() > multiThrow) {
            multiThrow = 'Not Active'
          } else {
            time = ms(multiThrow - Date.now());
            multiThrow = `Active for next ${time}`
          }
        }
        
        let embed = BaseEmbed(i)
          .setTitle(`${user.username}'s stats`)
          .setDescription(`**Snowman Height:**\n \`${man}m\`\n\n**Effects:**\nSnow Shield: \`${shield}\`\nSnow Magnet: \`${magnet}\`\nMulti Throw: \`${multiThrow}\`\n\n**Snow Wall**\nLevel: \`${wallLvl}\`\nHealth: \`${wallHealth}%\``)
        await i.reply({ embeds: [embed] })
      }
    } catch (e) {
      console.log(e)
    }
  },
};