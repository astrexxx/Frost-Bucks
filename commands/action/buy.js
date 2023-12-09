const { SlashCommandBuilder } = require('@discordjs/builders');
const BaseEmbed = require('../../Utils/BaseEmbed.js');
const Profile = require('../../models/user.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buy items from shop in exchange of snowballs')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Select an item to buy')
        .setRequired(true)
        .addChoices(
          { name: 'Multi Throw', value: 'multithrow' },
          { name: 'Snow Shield', value: 'snowshield' },
          { name: 'Snow Magnet', value: 'snowmagnet' },
          { name: 'Snowman Tag', value: 'tag' },
          { name: 'Snow Wall (L3)', value: 'sw3' },
          { name: 'Snow Wall (L2)', value: 'sw2' },
          { name: 'Snow Wall (L1)', value: 'sw1' },
        )),
  async execute(i) {
    try {
      let user = await Profile.findOne({ userId: i.user.id, guildId: i.guild.id });
      if (!user) {
        user = await new Profile({
          userId: i.user.id,
          guildId: i.guild.id
        }).save()
      }
      const item = i.options.getString('item');
      if (item == 'multithrow') {
        if (user.snowballs < 100) {
          const embed = BaseEmbed()
            .setDescription(`You don\'t have enough snowballs to buy this item.\nYou need \`100\` snowballs <:snowball:1182334321214890064>`)
            .setColor('Red')
          return i.reply({ embeds: [embed] })
        } else {
          await Profile.findOneAndUpdate(
            { userId: i.user.id, guildId: i.guild.id },
            { 
              $inc: { snowballs: -100 },
              $set: { "inventory.multiThrow": new Date(new Date().getTime() + 10*60000).getTime() } 
            }
          )
          return await i.reply(`You bought a multi throw for \`100\` snowballs <:snowball:1182334321214890064>\n*Activated for next 10 minutes.*`)
        }
      } else if (item == 'snowshield') {
        if (user.snowballs < 100) {
          const embed = BaseEmbed()
            .setDescription(`You don\'t have enough snowballs to buy this item.\nYou need \`100\` snowballs <:snowball:1182334321214890064>`)
            .setColor('Red')
          return i.reply({ embeds: [embed] })
        } else {
          await Profile.findOneAndUpdate(
            { userId: i.user.id, guildId: i.guild.id },
            { 
              $inc: { snowballs: -100 }, 
              $set: { "inventory.snowShield": new Date(new Date().getTime() + 20*60000).getTime() }
            }
          )

          return await i.reply(`You bought a snow shield for \`100\` snowballs <:snowball:1182334321214890064>\n*Activated for next 20 minutes.*`)
        }
      } else if (item == 'snowmagnet') {
        if (user.snowballs < 100) {
          const embed = BaseEmbed()
            .setDescription(`You don\'t have enough snowballs to buy this item.\nYou need \`100\` snowballs <:snowball:1182334321214890064>`)
            .setColor('Red')
          return i.reply({ embeds: [embed] })
        } else {
          await Profile.findOneAndUpdate(
            { userId: i.user.id, guildId: i.guild.id },
            { $inc: { snowballs: -100, "inventory.snowMagnet": new Date(new Date().getTime() + 5*60000).getTime() }}
          )
          return await i.reply(`You bought a snow magnet for \`100\` snowballs <:snowball:1182334321214890064>\n*Activated for next 5 minutes.*`)
        }
      } else if (item == 'snowmagnet') {
        if (user.inventory.tag == true) return i.reply(`You already have a snowman name tag.`)
        if (user.snowballs < 50) {
          const embed = BaseEmbed()
            .setDescription(`You don\'t have enough snowballs to buy this item.\nYou need \`50\` snowballs <:snowball:1182334321214890064>`)
            .setColor('Red')
          return i.reply({ embeds: [embed] })
        } else {
          await Profile.findOneAndUpdate(
            { userId: i.user.id, guildId: i.guild.id },
            { $set: { "inventory.tag": true }}
          )
          return await i.reply(`You bought a snowman name tag for \`50\` snowballs <:snowball:1182334321214890064>\n`)
        }
      } else if (item == 'sw1') {
        if (user.snowballs < 100) {
          const embed = BaseEmbed()
            .setDescription(`You don\'t have enough snowballs to buy this item.\nYou need \`100\` snowballs <:snowball:1182334321214890064>`)
            .setColor('Red')
          return i.reply({ embeds: [embed] })
        } else {
          await Profile.findOneAndUpdate(
            { userId: i.user.id, guildId: i.guild.id },
            { $set: { "snowWall.level": 1, "snowWall.health": 100 }}
          )

          return await i.reply(`You bought a snow wall (lvl 1) for \`100\` snowballs <:snowball:1182334321214890064>\n`)
        }
      } else if (item == 'sw2') {
        if (user.snowballs < 250) {
          const embed = BaseEmbed()
            .setDescription(`You don\'t have enough snowballs to buy this item.\nYou need \`100\` snowballs <:snowball:1182334321214890064>`)
            .setColor('Red')
          return i.reply({ embeds: [embed] })
        } else {
          await Profile.findOneAndUpdate(
            { userId: i.user.id, guildId: i.guild.id },
            { $set: { "snowWall.level": 2, "snowWall.health": 100 }}
          )

          return await i.reply(`You bought a snow wall (lvl 2) for \`250\` snowballs <:snowball:1182334321214890064>\n`)
        }
      } else if (item == 'sw1') {
        if (user.snowballs < 400) {
          const embed = BaseEmbed()
            .setDescription(`You don\'t have enough snowballs to buy this item.\nYou need \`400\` snowballs <:snowball:1182334321214890064>`)
            .setColor('Red')
          return i.reply({ embeds: [embed] })
        } else {
          await Profile.findOneAndUpdate(
            { userId: i.user.id, guildId: i.guild.id },
            { $set: { "snowWall.level": 3, "snowWall.health": 100 }}
          )

          return await i.reply(`You bought a snow wall (lvl 3) for \`400\` snowballs <:snowball:1182334321214890064>\n`)
        }
      }
    } catch(e) {
      console.log(e)
    }
  }
};