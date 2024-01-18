import { ApplicationCommandPermissions, Snowflake } from "discord.js";

export async function applicationCommandPermissionsUpdate(data: {
  id: Snowflake;
  guildId: Snowflake;
  applicationId: Snowflake;
  permissions: readonly ApplicationCommandPermissions[];
}) {
  // TODO
}
