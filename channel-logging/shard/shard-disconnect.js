/**
 * Emitted when a shard's WebSocket disconnects and will no longer reconnect.
 * @param {CloseEvent} event The WebSocket close event
 * @param {number} id The shard id that disconnected
 */
async function shardDisconnect(event, id) {
  // TODO
}

module.exports.shardDisconnect = shardDisconnect;
