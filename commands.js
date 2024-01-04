const fs = require("fs");
const path = require("path");
const { Database } = require("./database/mariadb");

async function getCustomCommandNameFromMessage(msg) {
  return null;
}

async function getCommandNameFromMessage(msg) {
  const prefix = (await Database.getSettings()).prefix ?? "!";
  let msgCommandName = msg.content.substring(prefix.length);
  if (msgCommandName.includes(" "))
    msgCommandName = msgCommandName.substring(0, msgCommandName.indexOf(" "));
  let commandName = null;
  let commandFiles = fs.readdirSync("./commands/");
  for (let commandFile of commandFiles) {
    let name = path.parse(commandFile).name;
    if (msgCommandName == name) commandName = name;
  }
  return !commandName ? getCustomCommandNameFromMessage(msg) : commandName;
}

function getCommandObject(commandName) {
  console.log(require(`./commands/${commandName}.js`));
}

async function handleCommands(
  msgOrInteraction,
  name,
  permissions,
  functionToRun,
) {
  for (let permission of permissions) {
    if (
      msgOrInteraction.channel
        .permissionsFor(msgOrInteraction.member)
        .has(permission)
    ) {
      return await functionToRun(msgOrInteraction);
    }
  }
  return await msgOrInteraction.reply({
    content: `You don't have permission for the command ${name} in this channel or server-wide!`,
  });
}

async function handleMessageCommands(msg) {
  const commandName = getCommandNameFromMessage(msg);
  if (!commandName) {
    //return await msg.reply({content: `The command ${commandName} does not exist!`});
    return null;
  }
  const { name, permissions, runMessage } = getCommandObject(commandName);
  return await handleCommands(msg, name, permissions, runMessage);
}

async function handleApplicationCommands(interaction) {
  const { name, permissions, runInteraction } = getCommandObject(
    interaction.commandName,
  );
  return await handleCommands(interaction, name, permissions, runInteraction);
}

module.exports.handleMessageCommands = handleMessageCommands;
module.exports.handleApplicationCommands = handleApplicationCommands;
