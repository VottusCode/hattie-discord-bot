import Client from './client/client';
import { logger } from './framework';
import { token, owner, roles } from '../config.json';
import Discord, { TextChannel, GuildMember } from 'discord.js';

const client = new Client({ token, owner });

logger.info('Starting bot...');

client.on('guildMemberAdd', async (member: GuildMember) => {
  const channel = member.guild.channels.cache.find(channel => channel.name === 'general');

  const joinEmbed = new Discord.MessageEmbed()
    .setTitle(`New member (${member.guild.memberCount})`)
    .setDescription(`Welcome ${member}!`)
    .setColor('#FF0000');

  await member.roles.add(roles.member);

  console.log(`${member.nickname} joined the server.`);
  (channel as TextChannel).send(joinEmbed);
});

client.on('ready', () => {
  console.log('Bot ready!');
});

client.start();
