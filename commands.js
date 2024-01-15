import { readdirSync } from "fs";
import { parse as parsePath } from "path";
import { Database } from "./database/mariadb.js";

function getAvailableDefaultCommandNames() {
  let commands = [];
  let commandFiles = readdirSync("./commands/");
  for (let commandFile of commandFiles) {
    let name = parsePath(commandFile).name;
    commands.push(name);
  }
  return commands;
}

async function getCustomCommandNameFromMessage(prefix, msg) {
  return null;
}

async function getCommandNameFromMessage(prefix, msg) {
  let msgCommandName = msg.content.substring(prefix.length);
  if (msgCommandName.includes(" "))
    msgCommandName = msgCommandName.substring(0, msgCommandName.indexOf(" "));
  let commandName = null;
  let commandFiles = readdirSync("./commands/");
  for (let commandFile of commandFiles) {
    let name = parsePath(commandFile).name;
    if (msgCommandName == name) commandName = name;
  }
  return !commandName ? getCustomCommandNameFromMessage(msg) : commandName;
}

function getCommandObject(commandName) {
  return require(`./commands/${commandName}.js`);
}

async function handleCommands(
  msgOrInteraction,
  name,
  permissions,
  functionToRun,
  prefix,
) {
  for (let permission of permissions) {
    if (
      msgOrInteraction.channel
        .permissionsFor(msgOrInteraction.member)
        .has(permission)
    ) {
      if (prefix) return await functionToRun(prefix, msgOrInteraction);
      else return await functionToRun(msgOrInteraction);
    }
  }
  return await msgOrInteraction.reply({
    content: `You don't have permission for the command ${name} in this channel or server-wide!`,
  });
}

export async function handleMessageCommands(msg) {
  const prefix = (await Database.getSettings()).prefix ?? "!";
  const commandName = getCommandNameFromMessage(prefix, msg);
  if (!commandName) {
    //return await msg.reply({content: `The command ${commandName} does not exist!`});
    return null;
  }
  const { name, permissions, runMessage } = getCommandObject(commandName);
  return await handleCommands(msg, name, permissions, runMessage, prefix);
}

export async function handleApplicationCommands(interaction) {
  const { name, permissions, runInteraction } = getCommandObject(
    interaction.commandName,
  );
  return await handleCommands(interaction, name, permissions, runInteraction);
}

export async function getRegisterArray() {
  return getAvailableDefaultCommandNames().forEach((commandName) => {
    return getCommandObject(commandName).registerObject;
  });
}
