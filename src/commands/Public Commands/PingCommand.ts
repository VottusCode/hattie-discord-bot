import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PingCommand extends Command {
  public constructor() {
    super("ping", {
      aliases: ["ping"],
      category: "Public Commands",
      description: {
        content: "Check latency of the bot to DiscordAPI",
        usage: "ping",
        examples: ["ping"],
      },
      ratelimit: 3,
    });
  }

  public exec(message: Message): Promise<Message> {
    return message.util.send(
      `Latency of the bot to the DiscordAPI is ${this.client.ws.ping}ms!`
    );
  }
}
