const { Presence } = require('discord.js');

/**
 * Emitted whenever a guild members presence (e.g. status, activity) is changed.
 * @param {?Presence} oldPresence The presence before the update, if one at all
 * @param {Presence} newPresence The presence after the update
 */
async function presenceUpdate(oldPresence, newPresence) {
    // TODO
}

module.exports.presenceUpdate = presenceUpdate;
