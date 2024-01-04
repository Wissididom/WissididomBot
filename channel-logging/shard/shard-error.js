/**
 * Emitted whenever a shard's WebSocket encounters a connection error.
 * @param {Error} error The encountered errror
 * @param {number} shardId The shard that encountered this error
 */
async function shardError(event, shardId) {
  // TODO
}

module.exports.shardError = shardError;
