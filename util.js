export function getComplexArgsFromMessage(msg) {
  if (msg.content.includes(" ")) return null;
  let command = msg.content.substring(0, msg.content.indexOf(" "));
  let args = msg.content.substring(command.length + 1);
  let argRegex = /([A-Za-z0-9-_]+):((?:[A-Za-z0-9-_]|\\ )+)/g;
  let argMatch = null;
  let argObj = {};
  while ((argMatch = argRegex.exec(args)) != null) {
    argObj[argMatch[1].toLowerCase()] = argMatch[2].replaceAll("\\", " ");
  }
  return argObj;
}

export function getArgsFromMessage(msg) {
  return msg.content.split(" ").slice(1);
}
