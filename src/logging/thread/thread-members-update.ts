import { Collection, Snowflake, ThreadChannel, ThreadMember } from "discord.js";

export async function threadMembersUpdate(
  addedMembers: Collection<Snowflake, ThreadMember>,
  removedMembers: Collection<Snowflake, ThreadMember>,
  thread: ThreadChannel,
) {
  // TODO
}
