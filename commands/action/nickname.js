const { SlashCommandBuilder } = require('@discordjs/builders');
const BaseEmbed = require('../../Utils/BaseEmbed.js');
const Profile = require('../../models/user.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Nickname your snowman.')
    .addStringOption(option => option.setName('nickname').setDescription('Enter the nickname.').setRequired(true)),
  async execute(i) {
    try {
      let user = await Profile.findOne({ userId: i.user.id, guildId: i.guild.id });
      if (!user) {
        user = await new Profile({
          userId: i.user.id,
          guildId: i.guild.id
        }).save()
      }

      let snowmanName = i.options.getString('nickname');
      if (snowmanName.length > 15 || snowmanName.length <= 3) {
        return i.reply(`Invalid nickname`)
      }
      const embed = BaseEmbed()
      if (!user.snowman.length || user.snowman.length < 1) {
        embed.setDescription(`You don't seem to have a snowman yet`)
        embed.setColor('Red')
        return i.reply({ embeds: [embed] })
      } else if (!user.inventory.tag) {
        embed.setDescription(`You don't have a snowman name tag, buy it from the shop.`)
        embed.setColor('Red')
        return i.reply({ embeds: [embed] })
      } else {

        await Profile.findOneAndUpdate(
          { userId: i.user.id, guildId: i.guild.id },
          { $set: { "snowman.nickname": snowmanName }}
        )
        embed.setDescription(`Say hi to our cutie ${snowmanName}!`)
        await i.reply({ embeds: [embed] })
      }

    } catch(e) {
      console.log(e)
    }
  }
}