const { ApplicationCommandPermissionsUpdateData } = require('discord.js');

/**
 * Emitted whenever permissions for an application command in a guild were updated.
 * 
 * This includes permission updates for other applications in addition to the logged in client, check `data.applicationId` to verify which application the update is for
 * @param {ApplicationCommandPermissionsUpdateData} data The updated permissions
 */
async function applicationCommandPermissionsUpdate(data) {
    // TODO
}

module.exports.applicationCommandPermissionsUpdate = applicationCommandPermissionsUpdate;
