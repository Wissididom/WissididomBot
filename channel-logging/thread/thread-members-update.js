const {
  Collection,
  Snowflake,
  ThreadChannel,
  ThreadMember,
} = require("discord.js");

/**
 * Emitted whenever members are added or removed from a thread.
 *
 * This event requires the `GatewayIntentBits.GuildMembers` privileged gateway intent.
 * @param {Collection<Snowflake, ThreadMember>} addedMembers The members that were added
 * @param {Collection<Snowflake, ThreadMember>} removedMembers The members that were removed
 * @param {ThreadChannel} thread The thread where members got updated
 */
async function threadMembersUpdate(addedMembers, removedMembers, thread) {
  // TODO
}

module.exports.threadMembersUpdate = threadMembersUpdate;
