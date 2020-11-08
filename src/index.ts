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

bot.on('message', (msg: Message) => $.modules.message(msg, $));

bot.once('ready', function (): void {
  bot.user.setActivity({ name: 'Type in`gc help` to get help.\nYou look beatiful today 🕊!' });
  console.log(`${info} Bot connected!`);
});

bot.login(process.env.BOT_TOKEN);