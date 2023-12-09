const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [];
const folders = fs.readdirSync("./commands/")
for (const files of folders) {
  const folder = fs.readdirSync(`./commands/${files}/`).filter(file => file.endsWith(".js"))

  for (const cmds of folder) {
    const command = require(`./commands/${files}/${cmds}`)
    commands.push(command.data.toJSON());
    console.log(`Loaded ${command.data.name}`)
  }
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.clientId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);