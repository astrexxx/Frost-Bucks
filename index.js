const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('node:fs');
const { connect } = require('mongoose');
const config = require('./config.json')
require("dotenv").config();
const express = require("express"),
  path = require('path')
const app = express();
const port = 8080;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates], partials: [Partials.Message, Partials.Reaction, Partials.User, Partials.GuildMember], allowedMentions: { repliedUser: false, parse: ["users"] } });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.commands = new Collection();

const folders = fs.readdirSync("./commands/")
for (const files of folders) {
  const folder = fs.readdirSync(`./commands/${files}/`).filter(file => file.endsWith(".js"))

  for (const cmds of folder) {
    const command = require(`./commands/${files}/${cmds}`)
    client.commands.set(command.data.name, command);
    console.log(`Loaded ${command.data.name}`)
  }
}

connect(process.env.mongouri);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
client.login(process.env.TOKEN);