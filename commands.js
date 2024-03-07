import { readdirSync } from "fs";
import { parse as parsePath } from "path";
import Database from "./database/mariadb.js";

import RememberBirthday from "./commands/remember-birthday.js";
import ForgetBirthday from "./commands/forget-birthday.js";
import Birthday from "./commands/birthday.js";

export function initDb() {
  Database.initDb();
}

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
  return !commandName
    ? getCustomCommandNameFromMessage(prefix, msg)
    : commandName;
}

async function getCommandObject(commandName) {
  switch (commandName) {
    case "remember-birthday":
      return RememberBirthday;
    case "forget-birthday":
      return ForgetBirthday;
    case "birthday":
      return Birthday;
    default:
      return null;
  }
}

async function handleCommands(
  msgOrInteraction,
  name,
  permissions,
  functionToRun,
  prefix,
  db,
) {
  if (permissions.length < 1) {
    if (prefix) return await functionToRun(prefix, msgOrInteraction, db);
    else return await functionToRun(msgOrInteraction, db);
  }
  for (let permission of permissions) {
    if (
      msgOrInteraction.channel
        ?.permissionsFor(msgOrInteraction.member)
        .has(permission)
    ) {
      if (prefix) return await functionToRun(prefix, msgOrInteraction, db);
      else return await functionToRun(msgOrInteraction, db);
    }
  }
  return await msgOrInteraction.reply({
    content: `You don't have permission for the command ${name} in this channel or server-wide!`,
  });
}

export async function handleMessageCommands(msg) {
  const prefix = (await Database.getSettings(msg.guildId))?.prefix ?? "!";
  const commandName = await getCommandNameFromMessage(prefix, msg);
  if (!commandName) {
    // Command does not exist
    return null;
  }
  const { name, permissions, runMessage } = await getCommandObject(commandName);
  return await handleCommands(
    msg,
    name,
    permissions,
    runMessage,
    prefix,
    Database,
  );
}

export async function handleApplicationCommands(interaction) {
  if (interaction.isCommand()) {
    const { name, permissions, runInteraction } = await getCommandObject(
      interaction.commandName,
    );
    return await handleCommands(
      interaction,
      name,
      permissions,
      runInteraction,
      null,
      Database,
    );
  }
  if (interaction.isAutocomplete()) {
    const { runAutocomplete } = await getCommandObject(interaction.commandName);
    return runAutocomplete(interaction, Database);
  }
}

export async function getRegisterArray() {
  let defaultCommandNames = getAvailableDefaultCommandNames();
  let registerArray = [];
  for (let i = 0; i < defaultCommandNames.length; i++) {
    let commandObject = await getCommandObject(defaultCommandNames[i]);
    registerArray.push(commandObject.registerObject());
  }
  return registerArray;
}
