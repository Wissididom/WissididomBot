const { VoiceState } = require("discord.js");

/**
 * Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
 * @param {VoiceState} oldState The voice state before the update
 * @param {VoiceState} newState The voice state after the update
 */
async function voiceStateUpdate(oldState, newState) {
  // TODO
}

module.exports.voiceStateUpdate = voiceStateUpdate;
