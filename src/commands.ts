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
import * as Commands from "./commands/index";

function getAvailableDefaultCommandNames() {
  return ["add-automod-rule", "add-logging-event"];
}

async function getCustomCommandNameFromMessage(prefix: string, msg: Message) {
  return null;
}

async function getCommandNameFromMessage(prefix: string, msg: Message) {
  let commandName: string = msg.content.substring(prefix.length);
  if (commandName.includes(" "))
    commandName = commandName.substring(0, commandName.indexOf(" "));
  return !commandName
    ? getCustomCommandNameFromMessage(prefix, msg)
    : commandName;
}

function getCommandObject(commandName: string): {
  name: string;
  description: string;
  permissions: bigint[];
  registerObject: () => Omit<
    SlashCommandBuilder,
    "addSubcommand" | "addSubcommandGroup"
  >;
  runMessage: (prefix: string, msg: Message) => Promise<void>;
  runInteraction: (interaction: Interaction) => Promise<void>;
} | null {
  switch (commandName) {
    case "add-automod-rule":
      return Commands.addAutoModRule;
    case "add-logging-event":
      return Commands.addLoggingEvent;
    default:
      return null;
  }
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
  const prefix: string =
    (await Database.getSettings(msg.guildId!))?.prefix ?? "!";
  const commandName: string | null = await getCommandNameFromMessage(
    prefix,
    msg,
  );
  if (!commandName) {
    return null; // Command does not exist
  }
  let commandObject = getCommandObject(commandName);
  if (!commandObject) return null;
  return await handleCommands(
    msg,
    commandObject.name,
    commandObject.permissions,
    commandObject.runMessage,
    prefix,
  );
}

export async function handleApplicationCommands(interaction: Interaction) {
  if (interaction.isCommand()) {
    let commandObject = getCommandObject(interaction.commandName);
    if (!commandObject) {
      let customCommandObject = null;
      if (!customCommandObject) {
        return await interaction.reply({
          content: "Command does not exist!",
        });
      } else {
        // TODO: Handle Custom Commands and overwrite commandObject variable
        return null;
      }
    }
    return await handleCommands(
      interaction,
      commandObject.name,
      commandObject.permissions,
      commandObject.runInteraction,
      null,
    );
  }
}

export function getRegisterArray() {
  let defaultCommandNames: string[] = getAvailableDefaultCommandNames();
  let registerArray: Omit<
    SlashCommandBuilder,
    "addSubcommand" | "addSubcommandGroup"
  >[] = [];
  for (let i = 0; i < defaultCommandNames.length; i++) {
    let commandObject = getCommandObject(defaultCommandNames[i]);
    if (!commandObject) continue;
    registerArray.push(commandObject.registerObject());
  }
  return registerArray;
}
