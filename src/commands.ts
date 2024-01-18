import { readdirSync } from "fs";
import { parse as parsePath } from "path";
import {
  AutocompleteInteraction,
  GuildMember,
  Interaction,
  Message,
  PermissionResolvable,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import Database from "./database/mariadb";

function getAvailableDefaultCommandNames() {
  let commands = [];
  let commandFiles = readdirSync("./commands/");
  for (let commandFile of commandFiles) {
    let name = parsePath(commandFile).name;
    commands.push(name);
  }
  return commands;
}

async function getCustomCommandNameFromMessage(prefix: string, msg: Message) {
  return null;
}

async function getCommandNameFromMessage(prefix: string, msg: Message) {
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

async function getCommandObject(commandName: string): Promise<{
  name: string;
  description: string;
  permissions: BigInt[];
  registerObject: () => SlashCommandBuilder;
  runMessage: (prefix: string, msg: Message) => Promise<void>;
  runInteraction: (interaction: Interaction) => Promise<void>;
}> {
  return await import(`./commands/${commandName}.js`);
}

async function handleCommands(
  msgOrInteraction: Message | Interaction,
  name: string,
  permissions: BigInt[],
  functionToRun:
    | ((prefix: string, msg: Message) => Promise<void>)
    | ((interaction: Interaction) => Promise<void>),
  prefix: string | null,
) {
  for (let permission of permissions) {
    if (
      (msgOrInteraction.channel as TextChannel)
        ?.permissionsFor(msgOrInteraction.member as GuildMember)
        .has(permission as PermissionResolvable)
    ) {
      if (prefix)
        return await (
          functionToRun as (prefix: string, msg: Message) => Promise<void>
        )(prefix, msgOrInteraction as Message);
      else
        return await (
          functionToRun as (interaction: Interaction) => Promise<void>
        )(msgOrInteraction as Interaction);
    }
  }
  if (msgOrInteraction instanceof Message) {
    return await msgOrInteraction.reply({
      content: `You don't have permission for the command ${name} in this channel or server-wide!`,
    });
  } else {
    if (msgOrInteraction instanceof AutocompleteInteraction) return;
    return await msgOrInteraction.reply({
      content: `You don't have permission for the command ${name} in this channel or server-wide!`,
    });
  }
}

export async function handleMessageCommands(msg: Message) {
  const prefix = (await Database.getSettings(msg.guildId!))?.prefix ?? "!";
  const commandName = await getCommandNameFromMessage(prefix, msg);
  if (!commandName) {
    //return await msg.reply({content: `The command ${commandName} does not exist!`});
    return null;
  }
  const { name, permissions, runMessage } = await getCommandObject(commandName);
  return await handleCommands(msg, name, permissions, runMessage, prefix);
}

export async function handleApplicationCommands(interaction: Interaction) {
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
    );
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
