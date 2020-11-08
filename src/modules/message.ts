import { Message } from "discord.js";
import App from "../interfaces/app.interface";
import Command from "../interfaces/command.interface";

module.exports = (msg: Message, $: App): void => {
  if (msg.channel.type === "dm") return;
  if (msg.author.bot) return;

  const command = require('../commands.enum')
    .find((command: Command): Boolean =>
      command.inputs.some((input: String): Boolean => (
        ((msg.content.toLowerCase().startsWith(`gc ${input}`) && !command.mod) || (msg.content.toLowerCase().startsWith(`!gc ${input}`) && command.mod))
      ))
    );

  if (command) $.modules[command.file](msg, $);
}