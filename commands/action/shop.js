const { SlashCommandBuilder } = require('@discordjs/builders');
const BaseEmbed = require('../../Utils/BaseEmbed.js');
const Profile = require('../../models/user.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('All the items you can buy'),
  async execute(i) {
    try {
      const embed = BaseEmbed(i)
      .setTitle(`Snow Shop`)
      .setDescription(`Multi Throw - \`100\` <:snowball:1182334321214890064>\nSnow Shield - \`100\` <:snowball:1182334321214890064>\nSnow Magnet - \`100\` <:snowball:1182334321214890064>\nSnowman Name Tag - \`50\` <:snowball:1182334321214890064>\nSnow Wall (LVL 1) - \`100\` <:snowball:1182334321214890064>\nSnow Wall (LVL 2) - \`250\` <:snowball:1182334321214890064>\nSnow Wall (LVL 3) - \`400\` <:snowball:1182334321214890064>`)

      await i.reply({ embeds: [embed] })
    } catch(e) {
      console.log(e)
    }
  }
}