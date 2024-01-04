async function moderateBot(msg) {
  // TODO: Delete Message and log action in logging channel if enabled
}

async function moderateUser(msg) {
  // TODO: Delete, timeout, kick, ban and log action in logging channel if enabled
  return false;
}

module.exports.moderateBot = moderateBot;
module.exports.moderateUser = moderateUser;
