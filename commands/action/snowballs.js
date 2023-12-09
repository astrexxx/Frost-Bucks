const { SlashCommandBuilder } = require('@discordjs/builders');
const BaseEmbed = require('../../Utils/BaseEmbed.js');
const Profile = require('../../models/user.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snowballs')
    .setDescription('Displays snowballs of a user.')
    .addUserOption(option => option.setName('target').setDescription('Select a user')),
  async execute(i) {
    try {
      let user = i.options.getUser('target') || i.user;
      let stats = await Profile.findOne({ userId: user.id, guildId: i.guild.id })
      if (!stats) {
        await i.reply(`**${user.username}** has no snowballs <:snowball:1182334321214890064>`)
      } else {
        let balls = stats.snowballs ?? 0;
        let thrown = stats.snowballsThrown ?? 0;
        
        let embed = BaseEmbed(i)
          .setTitle(`${user.username}'s snowball stats`)
          .setDescription(`Snowballs: \`${balls}\`\nSnowballs Thrown: \`${thrown}\``)
        await i.reply({ embeds: [embed] })
      }
    } catch (e) {
      console.log(e)
    }
  },
};