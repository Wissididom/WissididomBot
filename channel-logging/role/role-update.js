const { Role } = require("discord.js");

/**
 * Emitted whenever a guild role is updated.
 * @param {Role} oldRole The role before the update
 * @param {Role} newRole The role after the update
 */
async function roleUpdate(oldRole, newRole) {
  // TODO
}

module.exports.roleUpdate = roleUpdate;
