require("dotenv").config();

const { REST, Routes } = require("discord.js");
const { getRegisterArray } = require("./commands");

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error(
    "DISCORD_TOKEN not found! You must setup the DISCORD_TOKEN before running this bot.",
  );
}

const rest = new REST().setToken(token);

const registerArray = getRegisterArray();

(async () => {
  try {
    console.log(
      `Started refreshing ${registerArray.length} application (/) commands.`,
    );
    const userData = await rest.get(Routes.user());
    const userId = userData.id;
    const data = await rest.put(Routes.applicationCommands(userId), {
      body: registerArray,
    });
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (err) {
    console.error(err);
  }
})();
