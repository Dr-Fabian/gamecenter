import { Collection, GuildMember, Message, MessageEmbed, MessageReaction } from "discord.js";
import App from "../interfaces/app.interface";


function createEmbed(msg: Message, member: GuildMember, playerCards: Array<any>, botCards: Array<any>, playerWeight: number, botWeight: number, state: string) {
  
  let playerCardsAsString: string = 'null';
  let botCardsAsString: string = 'null';
  
  if (playerCards != null && botCards != null) {
    playerCardsAsString = '';
    for(let i: number = 0; i < playerCards.length; i++) {
      playerCardsAsString += ` ${playerCards[i].card} `;
    };
    botCardsAsString = '';
    for(let i: number = 0; i < botCards.length; i++) {
      botCardsAsString += ` ${botCards[i].card} `;
    };
  };

  const embed: MessageEmbed = new MessageEmbed()
    .setAuthor(`Playing with ${member.user.username}!`, member.user.avatarURL())
    .setColor("#000000")
    .setTitle('Blackjack')
    .setDescription(`Dont know how to play Blackjack? You can learn the rules [here](https://google.com)!`)
    .addField(`You: **${playerWeight}** points.`, playerCardsAsString, true)
    .addField(`Opponent: **${botWeight} points.**`, botCardsAsString, true)

  if(state == 'lost') {
    embed.addField('State:', `<@${member.user.id}>: **Unfortunately, you lost!**`);
  };

  if(state == 'won') {
    embed.addField('State:', `<@${member.user.id}>: **We got a winner!**`);
  };

  if(state == 'tie') {
    embed.addField('State:', `<@${member.user.id}>: **That's a tie!**`);
  };

  if(state == 'lost-first-round') {
    embed.addField('State:', `<@${member.user.id}>: **What a crime, you lost first round!**`);
  };

  return embed;
};

module.exports = async (msg: Message, $: App) => {
  msg.channel.startTyping();
  const embed: MessageEmbed = createEmbed(msg, msg.member, null, null, null, null, 'ongoing');

  const message: Message = await msg.channel.send(embed);
  new BlackJack(msg.member, message);
  msg.channel.stopTyping();
};

// Itaque egressi sumus incedentes, arma ad manum, patriam defendere. Fatum fuit nostri.

class BlackJack {

  private member: GuildMember;
  private message: Message;
  private suits: Array<string> = ['♥️', '♠️', '♢', '♣️']
  private values: Array<string> = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  private weights: Array<number> = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
  private deck: Array<any> = new Array<any>();
  private botHand: Array<any> = new Array<any>();
  private botScore: number = 1;
  private playerHand: Array<any> = new Array<any>();
  private playerScore: number = 1;

  constructor(targetMember: GuildMember, targetMessage: Message) {

    // Sets up default data
    this.member = targetMember;
    this.message = targetMessage;

    // Create Deck
    for (let k: number = 0; k < this.suits.length; k++) {
      for(let j: number = 0; j < this.values.length; j++) {
        this.deck.push({ card: `${this.suits[k]} ${this.values[j]}`, weight: this.weights[j] });
      };
    };

    // Create player's hand
    for (let i: number = 0; i < 2; i++) {
      let index: number = Math.floor(Math.random() * this.deck.length);
      let card: any = this.deck[index];
      this.playerHand.push(card);
      this.playerScore += card.weight;
      this.deck.splice(index, index+1);
    };

    // Create bot's hand
    for (let i: number = 0; i < 2; i++) {
      let index: number = Math.floor(Math.random() * this.deck.length);
      let card: any = this.deck[index];
      this.botHand.push(card);
      this.botScore += card.weight;
      this.deck.splice(index, index+1);
    }
    this.playerScore -= 1;
    this.botScore -= 1;
    this.message.edit(createEmbed(this.message, this.member, this.playerHand, this.botHand, this.playerScore, this.botScore, 'ongoing'));
    if (this.playerScore > 21) {
      this.message.edit(createEmbed(this.message, this.member, this.playerHand, this.botHand, this.playerScore, this.botScore, 'lost-first-round'));
    } else {
      this.react();
      this.play();
    };
  };

  // Reacts
  public react(): void {
    this.message.react('✅');
    this.message.react('❌');
  };

  // Waits for player to play
  public play(): void {

    // Waits for specific reactions from specific member
    this.message.awaitReactions(
      (reactions: MessageReaction, member: GuildMember): boolean => member.id == this.member.id && (reactions.emoji.name == '✅' || reactions.emoji.name == '❌'),
      { max: 1, time: 20000 }
    )
    .then((collected: Collection<string, MessageReaction>): void => {
      // Nothing collected
      if(collected.size == 0) {
        this.message.delete();
        this.message.channel.send(`**🔴 You didn't play!**`);
      // If hit
      } else if (collected.first().emoji.name == '✅') {
        // Gets random card
        let index: number = Math.floor(Math.random() * this.deck.length);
        let card: any = this.deck[index];
        // Adds card to player hand
        this.playerHand.push(card);
        // Adds score to player
        this.playerScore += card.weight;
        // Removes card from deck
        this.deck.splice(index, index+1);
        // Edits message
        this.message.edit(createEmbed(this.message, this.member, this.playerHand, this.botHand, this.playerScore, this.botScore, 'ongoing'));
        // If points > 21
        if (this.playerScore > 21) {
          // Send defeat message.
          this.message.edit(createEmbed(this.message, this.member, this.playerHand, this.botHand, this.playerScore, this.botScore, 'lost'));
        } else {
          this.play();
          // Remove reactions and re-add them
          this.message.reactions.removeAll();
          this.react();
        };
      // If stop
      } else if (collected.first().emoji.name == '❌') {
        // If bot has better hand
        if (this.botScore > this.playerScore) {
          // Send lose message
          this.message.edit(createEmbed(this.message, this.member, this.playerHand, this.botHand, this.playerScore, this.botScore, 'lost'));
        } else {
          // While the bot has a worse hand than the player do
          while (this.botScore < this.playerScore || this.botScore == this.playerScore) {
            // If bot has a score superior to 21
            if (this.botScore > 21) {
              // Send win message
              this.message.edit(createEmbed(this.message, this.member, this.playerHand, this.botHand, this.playerScore, this.botScore, 'won'));
              break;
            };
            // Else if bot has a better hand than the player
            if (this.botScore > this.playerScore) {
              // Send defeat message
              this.message.edit(createEmbed(this.message, this.member, this.playerHand, this.botHand, this.playerScore, this.botScore, 'lost'));
              break;
            };
            // Pick card
            let index: number = Math.floor(Math.random() * this.deck.length);
            let card: any = this.deck[index];
            this.botHand.push(card);
            this.botScore += card.weight;
            this.deck.splice(index, index+1);
            this.message.edit(createEmbed(this.message, this.member, this.playerHand, this.botHand, this.playerScore, this.botScore, 'ongoing'));
          };
          if (this.botScore > 21) {
            // Send win message
            this.message.edit(createEmbed(this.message, this.member, this.playerHand, this.botHand, this.playerScore, this.botScore, 'won'));
          };

          if (this.botScore > this.playerScore && this.botScore <= 21) {
            // Send defeat message
            this.message.edit(createEmbed(this.message, this.member, this.playerHand, this.botHand, this.playerScore, this.botScore, 'lost'));
          };

          if (this.botScore == this.playerScore) {
            // Send tie message
            this.message.edit(createEmbed(this.message, this.member, this.playerHand, this.botHand, this.playerScore, this.botScore, 'tie'));
          };
        };
      };
    });
  };
};