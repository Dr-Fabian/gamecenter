import { Client, Message } from "discord.js";
import { greenBright } from "chalk";
import * as mongoose from "mongoose";
import { config } from "dotenv";
import App from "./interfaces/app.interface";
import { loadModules } from "./loadModules";
config();

const bot: Client = new Client();
const info: string = `[${greenBright('INFO')}]`
const $: App = {
  database: mongoose,
  modules: loadModules(),
};

bot.once('ready', function(): void {
  console.log(`${info} Bot connected!`);
});

bot.login(process.env.BOT_TOKEN);