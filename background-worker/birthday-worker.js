let exportObj = {
  name: "birthday",
  description:
    "background worker that runs every hour to send birthday wishing messages",
  interval: 60 * 60 * 1000,
  runInterval: async (intervalObj, client, db) => {
    let currentDate = new Date();
    let birthdays = db.getBirthdays();
    for (let birthday of birthdays) {
      if (birthday.day == 29 && birthday.month == 2) {
        // TODO: Consider timezone from database
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();
        let day = currentDate.getDate();
        // Is Leap Year?
        if (year % 100 === 0 ? year % 400 === 0 : year % 4 === 0) {
          if (month == 3 && day == 1) {
            // Post on March 1st if it is a leap year
            // TODO: Post message and save last execution
            continue; // Skip further execution
          }
        }
        if (birthday.day == day && birthday.month == month) {
          // it's their birthday...
          // TODO: Post message and save last execution
        }
      }
    }
  },
};

export default exportObj;
