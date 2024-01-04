const { User } = require("discord.js");

/**
 * Emitted whenever a user's details (e.g. username) are changed. Triggered by the Discord gateway events Events.UserUpdate, Events.GuildMemberUpdate, and Events.PresenceUpdate.
 * @param {User} oldUser The user before the update
 * @param {User} newUser The user after the update
 */
async function userUpdate(oldUser, newUser) {
  // TODO
}

module.exports.userUpdate = userUpdate;
