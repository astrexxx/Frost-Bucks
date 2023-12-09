const { SlashCommandBuilder } = require("@discordjs/builders");
const BaseEmbed = require("../../Utils/BaseEmbed.js");
const Users = require("../../models/user.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("throw")
    .setDescription(`Throw a snowball at someone's snowman`)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Select a user to throw the snowball at.")
        .setRequired(true)
    ),
  async execute(i) {
    try {
      const user = i.options.getUser("target");
      if (!user) return i.reply(`Mention a user to throw the snowball at.`);
      let profile = await Users.findOne({
        userId: user.id,
        guildId: i.guild.id,
      });
      let userP = await Users.findOne({
        userId: i.user.id,
        guildId: i.guild.id,
      });
      if (!userP) {
        userP = await new Users({
          userId: i.user.id,
          guildId: i.guild.id,
        }).save();
      }
      if (!profile) {
        const errEmbed = BaseEmbed(i, { error: true }).setDescription(
          `You can't use this command on a bot user`
        );

        if (user.bot) return i.reply({ embeds: [errEmbed] });
        profile = await new Users({
          userId: user.id,
          guildId: i.guild.id,
        }).save();
      }
      const embed = BaseEmbed();
      if (!userP.snowballs || userP.snowballs < 1) {
        embed.setDescription(
          "You don't have any snowballs to throw!\n*Tip: They randomly spawn when someone's talking in a channel*"
        );
        embed.setColor("Red");
        return i.reply({ embeds: [embed] });
      }

      let lol = Math.floor(Math.random() * 1) + 1;

      if (profile.snowWall.level == 3 && profile.snowWall.health > 0) {
        lol = Math.floor(Math.random() * 7) + 1;
      } else if (profile.snowWall.level == 2 && profile.snowWall.health > 0) {
        lol = Math.floor(Math.random() * 5) + 1;
      } else if (profile.snowWall.level == 1 && profile.snowWall.health > 0) {
        lol = Math.floor(Math.random() * 3) + 1;
      }

      if (lol == 1) {
        if (profile.inventory.snowShield && profile.inventory.snowShield > Date.now()) {
          embed.setDescription(
            `You tried throwing a snowball at ${user.username} but they have snowshield activated ||*lol*||`
          );
          await Users.findOneAndUpdate(
            { userId: i.user.id, guildId: i.guild.id },
            { $inc: { snowballs: -1, snowballsThrown: 1 } }
          );
        } else if (!profile.snowman.height || profile.snowman.height < 6) {
          embed.setDescription(
            `You tried throwing a snowball at ${user.username} but their snowman isn't tall enough ||that's kinda sad honestly||`
          );
          await Users.findOneAndUpdate(
            { userId: i.user.id, guildId: i.guild.id },
            { $inc: { snowballs: -1, snowballsThrown: 1 } }
          );
        } else {
          if (profile.snowWall.level > 1 && profile.snowWall.health > 0) {
            console.log('t')
            let damage = Math.floor(Math.random() * 4) + 1;
            if (userP.inventory.multiThrow > Date.now()) {
              damage = Math.floor(Math.random() * 8) + 1;
            }
            await Users.findOneAndUpdate(
              { userId: i.user.id, guildId: i.guild.id },
              { $inc: { "snowWall.health": -damage } }
            );
          }
          embed.setDescription(
            `You threw a snowball at ${user.username}'s snowman <:snowball:1182334321214890064>`
          );

          let damage = 5;
          if (userP.inventory.multiThrow > Date.now()) {
            damage = 15;
          }

          await Users.findOneAndUpdate(
            { userId: i.user.id, guildId: i.guild.id },
            { $inc: { snowballs: -1, snowballsThrown: 1 } }
          );
          await Users.findOneAndUpdate(
            { userId: user.id, guildId: i.guild.id },
            { $inc: { "snowman.height": -damage } }
          );
        }
      } else {
        if (profile.snowWall.level > 1 && profile.snowWall.health > 0) {
          let damage = Math.floor(Math.random() * 4) + 1;
          if (userP.inventory.multiThrow > Date.now()) {
            damage = Math.floor(Math.random() * 8) + 1;
          }
          await Users.findOneAndUpdate(
            { userId: i.user.id, guildId: i.guild.id },
            { $inc: { "snowWall.health": -damage } }
          );
        }
        embed.setDescription(
          `You tried throwing a snowball at ${user.username}! but missed them :( ||BAHAHAHA||`
        );
        await Users.findOneAndUpdate(
          { userId: i.user.id, guildId: i.guild.id },
          { $inc: { snowballs: -1, snowballsThrown: 1 } }
        );
      }

      await i.reply({ embeds: [embed] });
    } catch (e) {
      console.log(e);
    }
  },
};
