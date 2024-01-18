import { Collection, Message, MessageReaction, Snowflake } from "discord.js";

export async function messageReactionRemoveAll(
  messageReaction: Message,
  reactions: Collection<string | Snowflake, MessageReaction>,
) {
  // TODO
}
