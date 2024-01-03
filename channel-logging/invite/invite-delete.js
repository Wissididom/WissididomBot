const { Invite } = require('discord.js');

/**
 * Emitted when an invite is deleted.
 * 
 * This event requires the `PermissionFlagsBits.ManageChannels` permission for the channel.
 * @param {Invite} invite The invite that was deleted
 */
async function inviteDelete(invite) {
    // TODO
}

module.exports.inviteDelete = inviteDelete;
