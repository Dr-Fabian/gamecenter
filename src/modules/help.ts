import { Message, MessageEmbed } from "discord.js";
import App from "../interfaces/app.interface";

module.exports = (msg: Message, $: App) => {
  const args: Array<string> = msg.content.trim().split(' ');
  args.splice(0, 2);

  if (args.length == 0) {
    const embed: MessageEmbed = new MessageEmbed()
      .setAuthor(`Requested by: ${msg.author.username}!`, msg.author.avatarURL())
      .setTitle('Game Center Help Command...')
      .setColor((Math.floor(Math.random() * 16777215)).toString(16))
      .setDescription(`Everything in curly-brackets '{}' **must** be passed as an argument.\nEvenything in brackets '[]' is **optionnal**.\nUse gc help {module_name}.`)
      .addField('Prefix', 'gc', true)
      .addField('Mod Prefix', '!gc', true)
      .addField(`Modules:`, '__•Fun\n•Games__');
    msg.channel.send(embed);
  } else if (/Fun/i.test(args[0])) {
    const embed: MessageEmbed = new MessageEmbed()
      .setAuthor(`Requested by: ${msg.author.username}!`, msg.author.avatarURL())
      .setTitle('Game Center Help Command...')
      .setColor((Math.floor(Math.random() * 16777215)).toString(16))
      .setDescription(`Everything in curly-brackets '{}' **must** be passed as an argument.\nEvenything in brackets '[]' is **optionnal**.\nUse gc help {command_name}.`)
      .addField('Prefix', 'gc', true)
      .addField('Mod Prefix', '!gc', true)
      .addField(`Commands:`, 'Lorem Ipsum.............');
    msg.channel.send(embed);
  }
}; 