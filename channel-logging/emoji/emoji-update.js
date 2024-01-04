const { GuildEmoji } = require("discord.js");

/**
 * Emitted whenever a custom emoji is updated in a guild.
 * @param {GuildEmoji} oldEmoji The old emoji
 * @param {GuildEmoji} newEmoji The new emoji
 */
async function emojiUpdate(emoji) {
  // TODO
}

module.exports.emojiUpdate = emojiUpdate;
