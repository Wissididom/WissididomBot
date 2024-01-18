import {
  ForumChannel,
  MediaChannel,
  NewsChannel,
  StageChannel,
  TextChannel,
  VoiceChannel,
} from "discord.js";

export async function webhooksUpdate(
  channel:
    | TextChannel
    | NewsChannel
    | VoiceChannel
    | StageChannel
    | ForumChannel
    | MediaChannel,
) {
  // TODO
}
