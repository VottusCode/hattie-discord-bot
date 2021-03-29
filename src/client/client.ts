import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { Intents } from "discord.js";
import { User, Message } from "discord.js";
import { join } from "path";
import { prefix, owner } from "../config";

declare module "discord-akairo" {
  interface AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
  }
}

interface BotOptions {
  token?: string;
  owner?: string;
}

export default class Client extends AkairoClient {
  public config: BotOptions;
  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, "..", "listeners"),
  });
  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join(__dirname, "..", "commands"),
    prefix: prefix,
    allowMention: true,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    defaultCooldown: 6e4,
    argumentDefaults: {
      prompt: {
        modifyStart: (_: Message, str: string): string =>
          `${str}\n\nType 'cancel' to cancel the command...`,
        modifyRetry: (_: Message, str: string): string =>
          `${str}\n\nType 'cancel' to cancel the command...`,
        timeout: "Waiting too long.. Command has been cancelled!",
        ended: "Maximum amount of tries, command has been cancelled!",
        cancel: "Command has been cancelled!",
        retries: 3,
        time: 3e4,
      },
      otherwise: "",
    },
    ignorePermissions: owner,
  });

  public constructor(config: BotOptions) {
    super({
      ownerID: config.owner,
      intents: Intents.PRIVILEGED,
    });
    this.config = config;
  }

  private async init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process,
    });
    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  public async start(): Promise<string> {
    await this.init();
    return this.login(this.config.token);
  }
}
