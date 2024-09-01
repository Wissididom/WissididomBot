import { DateTime, Interval } from "luxon";

async function sendMessage(client, channelId, userId, message) {
  if (channelId) {
    let channel = await client.channels.fetch(channelId);
    channel.send({ content: message, allowed_mentions: { parse: [] } });
  } else if (userId) {
    let user = await client.users.fetch(userId);
    user.send({ content: message, allowed_mentions: { parse: [] } });
  } else {
    console.log("Error: Channel and User is null or undefined!");
  }
}

let exportObj = {
  name: "birthday",
  description:
    "background worker that runs every hour to send birthday wishing messages",
  interval: 60 * 60 * 1000,
  runInterval: async (intervalObj, client, db) => {
    console.log("birthday ran");
    let birthdays = await db.getBirthdays();
    let birthdayWishingChannel = await db.getBirthdayWishingChannel();
    let birthdayWishingMessage = await db.getBirthdayWishingMessage();
    for (let birthday of birthdays) {
      let currentDate = DateTime.now().setZone(birthday.timezone);
      if (currentDate.hour != 0) continue; // Only run on hour 0 to prevent duplicates
      let birthDateTime = DateTime.fromObject(
        {
          day: birthday.day,
          month: birthday.month,
          year: birthday.year,
          hour: 0,
          minute: 0,
          second: 0,
        },
        {
          zone: birthday.timezone,
        },
      );
      let setAge = false;
      if (birthday.year) setAge = true;
      let age = Interval.fromDateTimes(birthDateTime, currentDate).length(
        "days",
      );
      if (birthday.day == 29 && birthday.month == 2) {
        // Is Leap Year?
        if (
          currentDate.year % 100 === 0
            ? currentDate.year % 400 === 0
            : currentDate.year % 4 === 0
        ) {
          if (currentDate.month == 3 && currentDate.day == 1) {
            // Post on March 1st if it is a leap year
            if (setAge) {
              await sendMessage(
                client,
                birthdayWishingChannel[birthday.serverId],
                birthday.userId,
                birthdayWishingMessage[
                  birthday.serverId
                ].birthdayWishingMessageWithAge
                  .replace("<userId>", birthday.userId)
                  .replace("<userMention>", `<@${birthday.userId}>`)
                  .replace("<age>", age),
              );
            } else {
              await sendMessage(
                client,
                birthdayWishingChannel[birthday.serverId],
                birthday.userId,
                birthdayWishingMessage[birthday.serverId].birthdayWishingMessage
                  .replace("<userId>", birthday.userId)
                  .replace("<userMention>", `<@${birthday.userId}>`),
              );
            }
          }
        }
        continue; // Skip further execution
      }
      if (
        birthday.day == currentDate.day &&
        birthday.month == currentDate.month &&
        currentDate.hour != 0
      ) {
        // it's their birthday...
        if (setAge) {
          await sendMessage(
            client,
            birthdayWishingChannel[birthday.serverId],
            birthday.userId,
            birthdayWishingMessage[
              birthday.serverId
            ].birthdayWishingMessageWithAge
              .replace("<userId>", birthday.userId)
              .replace("<userMention>", `<@${birthday.userId}>`)
              .replace("<age>", age),
          );
        } else {
          await sendMessage(
            client,
            birthdayWishingChannel[birthday.serverId],
            birthday.userId,
            birthdayWishingMessage[birthday.serverId].birthdayWishingMessage
              .replace("<userId>", birthday.userId)
              .replace("<userMention>", `<@${birthday.userId}>`),
          );
        }
      }
    }
  },
};

export default exportObj;
