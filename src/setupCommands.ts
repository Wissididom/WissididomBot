import * as DotEnv from "dotenv";
DotEnv.config();

import { REST, Routes, Snowflake } from "discord.js";
import { getRegisterArray } from "./commands";

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error(
    "DISCORD_TOKEN not found! You must setup the DISCORD_TOKEN before running this bot.",
  );
}

const rest = new REST().setToken(token);

(async () => {
  const registerArray = getRegisterArray();
  try {
    console.log(
      `Started refreshing ${registerArray.length} application (/) commands.`,
    );
    const userData: any = await rest.get(Routes.user());
    const userId: Snowflake = userData.id;
    const data: any = await rest.put(Routes.applicationCommands(userId), {
      body: registerArray,
    });
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (err) {
    console.error(err);
  }
})();
