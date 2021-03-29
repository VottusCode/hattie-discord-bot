import { Client, Message, Snowflake } from 'discord.js';

export interface CommandContext {
  client: Client;
  commands: Command[];
  args: string[];
}

export interface Command {
  name: string;
  description?: string | Array<string>;
  permissible?: {
    roles: Snowflake[]; // roles
    all: boolean; // whether all roles have to be present, or just one of them
  };
  ignoreBots?: boolean;
  run: (message: Message, context: CommandContext) => unknown;
}
