const { SlashCommandBuilder } = require('@discordjs/builders');
const BaseEmbed = require('../../Utils/BaseEmbed.js');
const Profile = require('../../models/user.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('build')
    .setDescription('Use a snowball to build your snowman.')
    .addIntegerOption(option => option.setName('balls').setDescription('Enter number of snowballs you want to use.').setMinValue(1).setRequired(true)),
  async execute(i) {
    try {
      let user = await Profile.findOne({ userId: i.user.id, guildId: i.guild.id });
      if (!user) {
        user = await new Profile({
          userId: i.user.id,
          guildId: i.guild.id
        }).save()
      }

      let snowmanName = user.snowman.nickname ?? 'snowman';

      const embed = BaseEmbed(i)
      if (!user.snowballs || user.snowballs < 1) {
        embed.setDescription(`You don\'t have any snowballs for your ${snowmanName}!\n*Tip: They randomly spawn when someone\'s talking in a channel*`)
        embed.setColor('Red')
        return i.reply({ embeds: [embed] })
      } else {
        const balls = i.options.getInteger('balls');
        if (balls > user.snowballs) return i.reply(`You only have \`${user.snowballs}\` <:snowball:1182334321214890064>`)
        if (balls < 1) return i.reply('You need to use at least 1 snowball.')
        let he = balls*5;
        await Profile.findOneAndUpdate(
          { userId: i.user.id, guildId: i.guild.id },
          { $inc: { snowballs: -balls, "snowman.height": he }}
        )
        
        embed.setDescription(`Your ${snowmanName} is of \`${user.snowman.height + he}m\` now.`)
        await i.reply({ embeds: [embed] })
      }

    } catch(e) {
      console.log(e)
    }
  }
}