import { Client } from "discord.js";
import { greenBright } from "chalk";
import * as mongoose from "mongoose";
import { config } from "dotenv";
config();

const bot: Client = new Client();
const info: string = `[${greenBright('INFO')}]`

bot.once('ready', function(): void {
  console.log(`${info} Bot connected!`)
});


bot.login(process.env.BOT_TOKEN);