const {
    Client,
    GatewayIntentBits,
    AttachmentBuilder,
    ActivityType,
    EmbedBuilder
} = require("discord.js");

const Canvas = require("canvas");
const Parser = require("rss-parser");
const cron = require("node-cron");
require("dotenv").config();

const parser = new Parser();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const DISCORD_CHANNEL_ID = "899332302335803412";
const YOUTUBE_CHANNEL_ID = "UC8sWDgxZXSW9oGBR-fuHyMw";

let lastVideo = "";

client.once("clientReady", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    client.user.setPresence({
        activities: [{ name: "Kutty Nethaji", type: ActivityType.Watching }],
        status: "dnd"
    });
});

client.on("guildMemberAdd", async (member) => {
    try {
        const canvas = Canvas.createCanvas(1536, 1024);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage("./welcome.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        let fontSize = 100;
        do {
            ctx.font = `${fontSize -= 2}px Arial`;
        } while (ctx.measureText(member.user.username).width > 900);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(member.user.username, 768, 1006);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), {
            name: "welcome.png"
        });

        const channel = member.guild.channels.cache.get("898741109843456003");

        if (!channel) return;

        await channel.send({
            content: `✨ Hello <@${member.id}>! Welcome to server! 🎉`,
            files: [attachment]
        });

    } catch (error) {
        console.error("Welcome error:", error);
    }
});

client.login(process.env.TOKEN);