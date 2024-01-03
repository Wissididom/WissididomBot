function getCommandNameFromMessage(msg) {
    return 'add-automod-rule';
}

function getCommandObject(commandName) {
    console.log(require(`./commands/${commandName}.js`));
}

function getAllowedCommandNames() {
    // TODO: Load dynamically with fs
    return [
        'add-automod-rule'
    ];
}

async function handleCommands(msgOrInteraction, name, permissions, functionToRun) {
    for (let permission of permissions) {
        if (msgOrInteraction.channel.permissionsFor(msgOrInteraction.member).has(permission)) {
            return await functionToRun(msgOrInteraction);
        }
    }
    return await msgOrInteraction.reply({content: `You don't have permission for the command ${name} in this channel or server-wide!`});
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
    const { name, permissions, runInteraction } = getCommandObject(interaction.commandName);
    return await handleCommands(interaction, name, permissions, runInteraction);
}

module.exports.handleMessageCommands = handleMessageCommands;
module.exports.handleApplicationCommands = handleApplicationCommands;
