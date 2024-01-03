const { ThreadMember } = require('discord.js');

/**
 * Emitted whenever the client user's thread member is updated.
 * @param {ThreadMember} oldMember The member before the update
 * @param {ThreadMember} newMember The member after the update
 */
async function threadMemberUpdate(oldMember, newMember) {
    // TODO
}

module.exports.threadMemberUpdate = threadMemberUpdate;
