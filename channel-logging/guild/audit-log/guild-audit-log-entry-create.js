const { GuildAuditLogsEntry, Guild } = require("discord.js");

/**
 * Emitted whenever a guild audit log entry is created.
 * @param {GuildAuditLogsEntry} auditLogEntry The entry that was created
 * @param {Guild} guild The guild where the entry was created
 */
async function guildAuditLogEntryCreate(auditLogEntry, guild) {
  // TODO
}

module.exports.guildAuditLogEntryCreate = guildAuditLogEntryCreate;
