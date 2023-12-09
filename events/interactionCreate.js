const Discord = require("discord.js");
const BaseEmbed = require('../Utils/BaseEmbed.js');
const Profile = require('../models/user.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    if (!interaction.guild.id) return i.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};