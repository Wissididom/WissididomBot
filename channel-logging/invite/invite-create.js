const { Invite } = require('discord.js');

/**
 * Emitted when an invite is created.
 * 
 * This event requires the `PermissionFlagsBits.ManageChannels` permission for the channel.
 * @param {Invite} invite The invite that was created
 */
async function inviteCreate(invite) {
    // TODO
}

module.exports.inviteCreate = inviteCreate;
