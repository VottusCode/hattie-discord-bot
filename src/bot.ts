import { MessageEmbed } from "discord.js";
import { GuildMember } from "discord.js";
import Client from "./client/client";
import { token, owner } from "./config";
import { logger } from "./utils/Logger";
import * as Discord from "discord.js";
import { TextChannel } from "discord.js";

const client: Client = new Client({ token, owner });
logger.color("blue").log("Starting bot...");
client.start();
client.on("guildMemberAdd", (member: GuildMember) => {
  let role = member.guild.roles.cache.find(
    (role) => role.id === "825973979906441226"
  );

  const channel = member.guild.channels.cache.find(
    (channel) => channel.name === "general"
  );

  const joinembed = new Discord.MessageEmbed()
    .setTitle(`New member (${member.guild.memberCount})`)
    .setDescription(`Welcome ${member}!`)
    .setColor("#FF0000");

  (channel as TextChannel).send(joinembed);

  member.roles.add(role).catch(console.error);
  console.log(`${member} joined to the server.`);
  console.log(`Role: ${role}`);
});
