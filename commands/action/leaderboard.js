const { SlashCommandBuilder } = require('@discordjs/builders');
const BaseEmbed = require('../../Utils/BaseEmbed.js');
const Profile = require('../../models/user.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Displays snow leaderboard')
    .addStringOption(option =>
      option.setName('value')
        .setDescription('Leaderboard type')
        .setRequired(true)
        .addChoices(
          { name: 'Snowballs', value: 'balls' },
          { name: 'Snowman', value: 'man' }
        )),
  async execute(i) {
    const type = i.options.getString('value');
    if (!type) return;

    if (type.toLowerCase() == 'balls') {

      let embed = BaseEmbed(i)
      let lb = await Profile.find({ guildId: i.guild.id }).sort({ snowballs: -1 }).limit(10)
      for (let a = 0; a < lb.length; a++) {
        if (lb[a].snowballs) {
          let puser = await i.client.users.fetch(`${lb[a].userId}`);

          embed.addFields({ name: `#${a + 1} **${puser.username}**`, value: `${lb[a].snowballs} <:snowball:1182334321214890064>` })
        }
      }
      embed.setDescription(`**Snowball Leaderboard**`)
      embed.setTimestamp()

      await i.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

    } else if (type.toLowerCase() == 'man') {

      let embed = BaseEmbed(i)
      let lb = await Profile.find({ guildId: i.guild.id }).sort({ "snowman.height": -1 }).limit(10)
      for (let a = 0; a < lb.length; a++) {
        if (lb[a].snowman.height) {
          let puser = await i.client.users.fetch(`${lb[a].userId}`);

          embed.addFields({ name: `#${a + 1} **${puser.username}**`, value: `${lb[a].snowman.height}m` })
        }
      }
      embed.setDescription(`**Snowman Height LB**`)
      embed.setTimestamp()

      await i.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

    }
  },
};