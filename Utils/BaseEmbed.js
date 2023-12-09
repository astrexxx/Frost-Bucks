const { EmbedBuilder } = require("discord.js");
const config = require('../config.json')

function BaseEmbed(i) {
  return new EmbedBuilder()
    .setColor(config.embedColor)
    .setTimestamp()
}

module.exports = BaseEmbed;