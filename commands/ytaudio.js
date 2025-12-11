export default {
  name: "yta",
  desc: "download youtube audio: .yta <link>",
  exec: async ({ sock, m, args }) => {
    const url = args[0];
    if (!url) return await sock.sendMessage(m.key.remoteJid, { text: "Send: .yta <YouTube link>" });
    const ytdl = (await import("@distube/ytdl-core")).default;
    try {
      const info = await ytdl.getInfo(url);
      const stream = ytdl(url, { filter: "audioonly", quality: "highestaudio" });
      await sock.sendMessage(m.key.remoteJid, { text: `Downloading ${info.videoDetails.title}...` });
      await sock.sendMessage(m.key.remoteJid, { audio: { stream }, mimetype: "audio/mp4" });
    } catch (e) {
      await sock.sendMessage(m.key.remoteJid, { text: "YTA failed." });
    }
  }
};
