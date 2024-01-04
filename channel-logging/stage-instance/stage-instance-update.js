const { StageInstance } = require("discord.js");

/**
 * Emitted whenever a stage instance gets updated - e.g. change in topic or privacy level.
 * @param {?StageInstance} oldStageInstance The stage instance before the update
 * @param {StageInstance} newStageInstance The stage instance after the update
 */
async function stageInstanceUpdate(oldStageInstance, newStageInstance) {
  // TODO
}

module.exports.stageInstanceUpdate = stageInstanceUpdate;
