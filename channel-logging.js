const {
  applicationCommandPermissionsUpdate,
} = require("./channel-logging/application-command/application-command-permissions-update");
const {
  autoModerationActionExecuted,
} = require("./channel-logging/auto-moderation/auto-moderation-action-execution");
const {
  autoModerationRuleCreate,
} = require("./channel-logging/auto-moderation/auto-moderation-rule-create");
const {
  autoModerationRuleDelete,
} = require("./channel-logging/auto-moderation/auto-moderation-rule-delete");
const {
  autoModerationRuleUpdate,
} = require("./channel-logging/auto-moderation/auto-moderation-rule-update");
const { channelCreate } = require("./channel-logging/channel/channel-create");
const { channelDelete } = require("./channel-logging/channel/channel-delete");
const {
  channelPinsUpdate,
} = require("./channel-logging/channel/channel-pins-update");
const { channelUpdate } = require("./channel-logging/channel/channel-update");
const { emojiCreate } = require("./channel-logging/emoji/emoji-create");
const { emojiDelete } = require("./channel-logging/emoji/emoji-delete");
const { emojiUpdate } = require("./channel-logging/emoji/emoji-update");
const {
  entitlementCreate,
} = require("./channel-logging/entitlement/entitlement-create");
const {
  entitlementDelete,
} = require("./channel-logging/entitlement/entitlement-delete");
const {
  entitlementUpdate,
} = require("./channel-logging/entitlement/entitlement-update");
const {
  guildAuditLogEntryCreate,
} = require("./channel-logging/guild/audit-log/guild-audit-log-entry-create");
const {
  guildAvailable,
} = require("./channel-logging/guild/availability/guild-available");
const {
  guildUnavailable,
} = require("./channel-logging/guild/availability/guild-unavailable");
const { guildBanAdd } = require("./channel-logging/guild/ban/guild-ban-add");
const {
  guildBanRemove,
} = require("./channel-logging/guild/ban/guild-ban-remove");
const {
  guildIntegrationsUpdate,
} = require("./channel-logging/guild/integrations/guild-integrations-update");
const {
  guildMemberAdd,
} = require("./channel-logging/guild/member/guild-member-add");
const {
  guildMemberAvailable,
} = require("./channel-logging/guild/member/guild-member-available");
const {
  guildMemberRemove,
} = require("./channel-logging/guild/member/guild-member-remove");
const {
  guildMemberUpdate,
} = require("./channel-logging/guild/member/guild-member-update");
const {
  guildScheduledEventCreate,
} = require("./channel-logging/guild/scheduled-event/guild-scheduled-event-create");
const {
  guildScheduledEventDelete,
} = require("./channel-logging/guild/scheduled-event/guild-scheduled-event-delete");
const {
  guildScheduledEventUpdate,
} = require("./channel-logging/guild/scheduled-event/guild-scheduled-event-update");
const {
  guildScheduledEventUserAdd,
} = require("./channel-logging/guild/scheduled-event/guild-scheduled-event-user-add");
const {
  guildScheduledEventUserRemove,
} = require("./channel-logging/guild/scheduled-event/guild-scheduled-event-user-remove");
const { guildCreate } = require("./channel-logging/guild/guild-create");
const { guildDelete } = require("./channel-logging/guild/guild-delete");
const { guildUpdate } = require("./channel-logging/guild/guild-update");
const { inviteCreate } = require("./channel-logging/invite/invite-create");
const { inviteDelete } = require("./channel-logging/invite/invite-delete");
const {
  messageReactionAdd,
} = require("./channel-logging/message/reaction/message-reaction-add");
const {
  messageReactionRemove,
} = require("./channel-logging/message/reaction/message-reaction-remove");
const {
  messageReactionRemoveAll,
} = require("./channel-logging/message/reaction/message-reaction-remove-all");
const {
  messageReactionRemoveEmoji,
} = require("./channel-logging/message/reaction/message-reaction-remove-emoji");
const { messageDelete } = require("./channel-logging/message/message-delete");
const {
  messageDeleteBulk,
} = require("./channel-logging/message/message-delete-bulk");
const { messageUpdate } = require("./channel-logging/message/message-update");
const {
  presenceUpdate,
} = require("./channel-logging/presence/presence-update");
const { roleCreate } = require("./channel-logging/role/role-create");
const { roleDelete } = require("./channel-logging/role/role-delete");
const { roleUpdate } = require("./channel-logging/role/role-update");
const { shardDisconnect } = require("./channel-logging/shard/shard-disconnect");
const { shardError } = require("./channel-logging/shard/shard-error");
const { shardReady } = require("./channel-logging/shard/shard-ready");
const {
  shardReconnecting,
} = require("./channel-logging/shard/shard-reconnecting");
const { shardResume } = require("./channel-logging/shard/shard-resume");
const {
  stageInstanceCreate,
} = require("./channel-logging/stage-instance/stage-instance-create");
const {
  stageInstanceDelete,
} = require("./channel-logging/stage-instance/stage-instance-delete");
const {
  stageInstanceUpdate,
} = require("./channel-logging/stage-instance/stage-instance-update");
const { stickerCreate } = require("./channel-logging/sticker/sticker-create");
const { stickerDelete } = require("./channel-logging/sticker/sticker-delete");
const { stickerUpdate } = require("./channel-logging/sticker/sticker-update");
const { threadCreate } = require("./channel-logging/thread/thread-create");
const { threadDelete } = require("./channel-logging/thread/thread-delete");
const { threadListSync } = require("./channel-logging/thread/thread-list-sync");
const {
  threadMemberUpdate,
} = require("./channel-logging/thread/thread-member-update");
const {
  threadMembersUpdate,
} = require("./channel-logging/thread/thread-members-update");
const { threadUpdate } = require("./channel-logging/thread/thread-update");
const { typingStart } = require("./channel-logging/typing-start");
const { userUpdate } = require("./channel-logging/user-update");
const { voiceStateUpdate } = require("./channel-logging/voice-state-update");
const { webhooksUpdate } = require("./channel-logging/webhooks-update");

module.exports = {
  applicationCommandPermissionsUpdate,
  autoModerationActionExecuted,
  autoModerationRuleCreate,
  autoModerationRuleDelete,
  autoModerationRuleUpdate,
  channelCreate,
  channelDelete,
  channelPinsUpdate,
  channelUpdate,
  emojiCreate,
  emojiDelete,
  emojiUpdate,
  entitlementCreate,
  entitlementDelete,
  entitlementUpdate,
  guildAuditLogEntryCreate,
  guildAvailable,
  guildUnavailable,
  guildBanAdd,
  guildBanRemove,
  guildIntegrationsUpdate,
  guildMemberAdd,
  guildMemberAvailable,
  guildMemberRemove,
  guildMemberUpdate,
  guildScheduledEventCreate,
  guildScheduledEventDelete,
  guildScheduledEventUpdate,
  guildScheduledEventUserAdd,
  guildScheduledEventUserRemove,
  guildCreate,
  guildDelete,
  guildUpdate,
  inviteCreate,
  inviteDelete,
  messageReactionAdd,
  messageReactionRemove,
  messageReactionRemoveAll,
  messageReactionRemoveEmoji,
  messageDelete,
  messageDeleteBulk,
  messageUpdate,
  presenceUpdate,
  roleCreate,
  roleDelete,
  roleUpdate,
  shardDisconnect,
  shardError,
  shardReady,
  shardReconnecting,
  shardResume,
  stageInstanceCreate,
  stageInstanceDelete,
  stageInstanceUpdate,
  stickerCreate,
  stickerDelete,
  stickerUpdate,
  threadCreate,
  threadDelete,
  threadListSync,
  threadMemberUpdate,
  threadMembersUpdate,
  threadUpdate,
  typingStart,
  userUpdate,
  voiceStateUpdate,
  webhooksUpdate,
};
