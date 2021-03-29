import { Command } from '../types';

export const defineCommand = (cmd: Command) => {
  if (cmd.description instanceof Array) cmd.description = cmd.description.join('\n');

  return cmd;
};
