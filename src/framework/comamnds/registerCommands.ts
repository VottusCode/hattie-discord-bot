import { Client } from 'discord.js';
import { sync as glob } from 'glob';
import { Command } from '../types';
import logger from '../utils/logger';
import { prefix } from '../../../config.json';

const importCommands = async (path: string) => {
  const files = glob(path);
  const commands: Command[] = [];

  for (const file of files) {
    try {
      const cmd = (await import(file)).default as Command;
      commands.push(cmd);
    } catch (e) {
      logger.error(`Failed to import ${file}`);
      throw e;
    }
  }

  return commands;
};

interface RegisterCommands {
  client: Client;
  commands: Command[];
}

const registerCommands = async ({ client, commands }: RegisterCommands) => {
  client.on('message', message => {
    if (!message.content.startsWith(prefix) || !message.guild) return false;

    const args = message.content.slice(prefix.length).trim().split(' ');

    const commandName = args.shift().toLowerCase();

    const command = commands.find(cmd => cmd.name === commandName);

    if (message.author.bot && command.ignoreBots) return;

    const roles = message.member.roles.cache.array();

    if (command.permissible) {
      const allowed = roles[command.permissible.all ? 'every' : 'some'](role =>
        command.permissible.roles.includes(role.id)
      );
      if (!allowed) return message.reply('you are not allowed to use this command!');
    }

    return command.run(message, {
      args,
      client,
      commands,
    });
  });
};

export { importCommands, RegisterCommands, registerCommands };
