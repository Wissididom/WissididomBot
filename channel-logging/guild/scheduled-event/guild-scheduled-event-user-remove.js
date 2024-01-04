const { GuildScheduledEvent, User } = require("discord.js");

/**
 * Emitted whenever a user unsubscribes from a guild scheduled event.
 * @param {GuildScheduledEvent} guildScheduledEvent The guild scheduled event
 * @param {User} user The user who unsubscribed
 */
async function guildScheduledEventUserRemove(guildScheduledEvent, user) {
  // TODO
}

module.exports.guildScheduledEventUserRemove = guildScheduledEventUserRemove;
