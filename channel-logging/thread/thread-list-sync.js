const { Collection, Guild, Snowflake, ThreadChannel } = require('discord.js');

/**
 * Emitted whenever the client user gains access to a text or news channel that contains threads
 * @param {Collection<Snowflake, ThreadChannel>} threads The threads that were synced
 * @param {Guild} guild The guild that the threads were synced in
 */
async function threadListSync(threads, guild) {
    // TODO
}

module.exports.threadListSync = threadListSync;
