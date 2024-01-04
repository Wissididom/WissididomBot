const { Snowflake } = require("discord.js");

/**
 * Emitted when a shard turns ready.
 * @param {number} id The shard id that turned ready
 * @param {?Set<Snowflake>} unavailableGuilds Set of unavailable guild ids, if any
 */
async function shardReady(id, unavailableGuilds) {
  // TODO
}

module.exports.shardReady = shardReady;
