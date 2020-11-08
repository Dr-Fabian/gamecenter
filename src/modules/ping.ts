import { Message, MessageEmbed } from "discord.js";
import App from "../interfaces/app.interface";

module.exports = (msg: Message, $: App): void => {
  msg.channel.send(
    new MessageEmbed()
      .setAuthor(`Requested by: ${msg.author.username}!`, msg.author.avatarURL())
      .setColor((Math.floor(Math.random() * 16777215)).toString(16))
      .setTitle('Game Center Ping Command...')
      .setDescription(`**PONG!** 🏓
      •Discord API: *${msg.guild.me.user.client.ws.ping}ms*...
      `)
  );
}