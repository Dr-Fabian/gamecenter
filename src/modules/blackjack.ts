import { Collection, GuildMember, Message, MessageEmbed, MessageReaction } from "discord.js";
import App from "../interfaces/app.interface";

module.exports = async (msg: Message, $: App) => {
  msg.channel.startTyping();
  const embed: MessageEmbed = new MessageEmbed()
    .setAuthor(`Playing with ${msg.author.username}!`, msg.author.avatarURL())
    .setColor("#000000")
    .setTitle('Blackjack')
    .setDescription(`You can learn the rules [here](https://google.com)!`)
    .addField('You', '[CARDS]', true)
    .addField('Opponent', `[CARDS]`, true);

  const message: Message = await msg.channel.send(embed);
  const game: BlackJack = new BlackJack(msg.member, message);
  game.react();
  game.awaitMove();
  msg.channel.stopTyping();
}





class BlackJack {

  private member: GuildMember;
  private message: Message;

  constructor(targetMember: GuildMember, targetMessage: Message) {
    this.member = targetMember;
    this.message = targetMessage;
  }

  public react(): void {
    this.message.react('✅');
    this.message.react('❌');
  }

  public awaitMove(): void {
    this.message.awaitReactions(
      (reactions: MessageReaction, member: GuildMember): boolean => member.id == this.member.id && (reactions.emoji.name == '✅' || reactions.emoji.name == '❌'),
      { max: 1, time: 20000 }
    )
    .then((collected: Collection<string, MessageReaction>): void => {
      if(collected.size == 0) {
        this.message.delete();
        this.message.channel.send(`**🔴 You didn't play!**`);
      }
      this.message.reactions.removeAll();
    });
  }

}