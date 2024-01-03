require('dotenv').config();

const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const {
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
    webhooksUpdate
} = require("./channel-logging");
const { moderateBot, moderateUser } = require("./moderation");
const { handleMessageCommands, handleApplicationCommands } = require("./commands");

const client = new Client({
	intents: [
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping, // Probably not needed and removed later
        GatewayIntentBits.DirectMessages,
        // GatewayIntentBits.GuildBans, // old name for GuildModeration
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping, // Probably not needed and removed later
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
	],
	partials: [
		Partials.User,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction
	]
});

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async msg => {
  if (msg.author.bot) {
    moderateBot(msg);
  } else {
    let moderated = await moderateUser(msg);
    if (!moderated) {
        await handleMessageCommands(msg);
    }
  }
});

client.on(Events.InteractionCreate, async interaction => {
  await handleApplicationCommands(interaction);
});

client.on(Events.ApplicationCommandPermissionsUpdate, applicationCommandPermissionsUpdate);
client.on(Events.AutoModerationActionExecution, autoModerationActionExecuted);
client.on(Events.AutoModerationRuleCreate, autoModerationRuleCreate);
client.on(Events.AutoModerationRuleDelete, autoModerationRuleDelete);
client.on(Events.AutoModerationRuleUpdate, autoModerationRuleUpdate);
client.on(Events.ChannelCreate, channelCreate);
client.on(Events.ChannelDelete, channelDelete);
client.on(Events.ChannelPinsUpdate, channelPinsUpdate);
client.on(Events.ChannelUpdate, channelUpdate);
client.on(Events.GuildEmojiCreate, emojiCreate);
client.on(Events.GuildEmojiDelete, emojiDelete);
client.on(Events.GuildEmojiUpdate, emojiUpdate);
client.on(Events.EntitlementCreate, entitlementCreate); // Event doesn't seem to exist yet
client.on(Events.EntitlementDelete, entitlementDelete); // Event doesn't seem to exist yet
client.on(Events.EntitlementUpdate, entitlementUpdate); // Event doesn't seem to exist yet
client.on(Events.GuildAuditLogEntryCreate, guildAuditLogEntryCreate);
client.on(Events.GuildAvailable, guildAvailable);
client.on(Events.GuildUnavailable, guildUnavailable);
client.on(Events.GuildBanAdd, guildBanAdd);
client.on(Events.GuildBanRemove, guildBanRemove);
client.on(Events.GuildIntegrationsUpdate, guildIntegrationsUpdate);
client.on(Events.GuildMemberAdd, guildMemberAdd);
client.on(Events.GuildMemberAvailable, guildMemberAvailable);
client.on(Events.GuildMemberUpdate, guildMemberUpdate);
client.on(Events.GuildScheduledEventCreate, guildScheduledEventCreate);
client.on(Events.GuildScheduledEventDelete, guildScheduledEventDelete);
client.on(Events.GuildScheduledEventUpdate, guildScheduledEventUpdate);
client.on(Events.GuildScheduledEventUserAdd, guildScheduledEventUserAdd);
client.on(Events.GuildScheduledEventUserRemove, guildScheduledEventUserRemove);
client.on(Events.GuildCreate, guildCreate);
client.on(Events.GuildDelete, guildDelete);
client.on(Events.GuildUpdate, guildUpdate);
client.on(Events.InviteDelete, inviteCreate);
client.on(Events.InviteDelete, inviteDelete);
client.on(Events.MessageReactionAdd, messageReactionAdd);
client.on(Events.MessageReactionRemove, messageReactionRemove);
client.on(Events.MessageReactionRemoveAll, messageReactionRemoveAll);
client.on(Events.MessageReactionRemoveEmoji, messageReactionRemoveEmoji);
client.on(Events.MessageDelete, messageDelete);
client.on(Events.MessageBulkDelete, messageDeleteBulk);
client.on(Events.MessageUpdate, messageUpdate);
client.on(Events.PresenceUpdate, presenceUpdate);
client.on(Events.GuildRoleCreate, roleCreate);
client.on(Events.GuildRoleDelete, roleDelete);
client.on(Events.GuildRoleUpdate, roleUpdate);
client.on(Events.ShardDisconnect, shardDisconnect);
client.on(Events.ShardError, shardError);
client.on(Events.ShardReady, shardReady);
client.on(Events.ShardReconnecting, shardReconnecting);
client.on(Events.ShardResume, shardResume);
client.on(Events.StageInstanceCreate, stageInstanceCreate);
client.on(Events.StageInstanceDelete, stageInstanceDelete);
client.on(Events.StageInstanceUpdate, stageInstanceUpdate);
client.on(Events.GuildStickerCreate, stickerCreate);
client.on(Events.GuildStickerDelete, stickerDelete);
client.on(Events.GuildStickerUpdate, stickerUpdate);
client.on(Events.ThreadCreate, threadCreate);
client.on(Events.ThreadDelete, threadDelete);
client.on(Events.ThreadListSync, threadListSync);
client.on(Events.ThreadMemberUpdate, threadMemberUpdate);
client.on(Events.ThreadMembersUpdate, threadMembersUpdate);
client.on(Events.ThreadUpdate, threadUpdate);
client.on(Events.TypingStart, typingStart);
client.on(Events.UserUpdate, userUpdate);
client.on(Events.VoiceStateUpdate, voiceStateUpdate);
client.on(Events.WebhooksUpdate, webhooksUpdate);

if (!process.env.DISCORD_TOKEN) {
  console.log("DISCORD_TOKEN not found! You must specify your Discord bot token as DISCORD_TOKEN environment variable or put it in a `.env` file.");
} else {
  client.login(process.env.DISCORD_TOKEN);
}
