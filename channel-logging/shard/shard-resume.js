/**
 * Emitted when a shard resumes successfully.
 * @param {number} id The shard id that resumed
 * @param {number} replayedEvents The amount of replayed events
 */
async function shardResume(id, replayedEvents) {
  // TODO
}

module.exports.shardResume = shardResume;
