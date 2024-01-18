import { Message } from "discord.js";

export function getComplexArgsFromMessage(
  msg: Message,
): { [key: string]: string } | null {
  if (msg.content.includes(" ")) return null;
  let command: string = msg.content.substring(0, msg.content.indexOf(" "));
  let args: string = msg.content.substring(command.length + 1);
  let argRegex: RegExp = /([A-Za-z0-9-_]+):((?:[A-Za-z0-9-_]|\\ )+)/g;
  let argMatch: RegExpExecArray | null = null;
  let argObj: { [key: string]: string } = {};
  while ((argMatch = argRegex.exec(args)) != null) {
    argObj[argMatch[1].toLowerCase()] = argMatch[2].replaceAll("\\ ", " ");
  }
  return argObj;
}

export function getArgsFromMessage(msg: Message): string[] {
  return msg.content.split(" ").slice(1);
}
