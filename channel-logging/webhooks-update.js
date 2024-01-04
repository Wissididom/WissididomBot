const {
  TextChannel,
  NewsChannel,
  VoiceChannel,
  StageChannel,
  ForumChannel,
  MediaChannel,
} = require("discord.js");

/**
 * Emitted whenever a channel has its webhooks changed.
 * @param {TextChannel | NewsChannel | VoiceChannel | StageChannel | ForumChannel | MediaChannel} channel The channel that had a webhook update
 */
async function webhooksUpdate(channel) {
  // TODO
}

module.exports.webhooksUpdate = webhooksUpdate;
