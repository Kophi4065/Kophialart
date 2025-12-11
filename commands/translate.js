export default {
  name: "tr",
  desc: "translate: .tr <text>",
  exec: async ({ sock, m, args }) => {
    const text = args.join(" ");
    if (!text) return await sock.sendMessage(m.key.remoteJid, { text: "Usage: .tr <text>" });
    try {
      const translate = (await import("@vitalets/google-translate-api")).default;
      const res = await translate(text, { to: "en" });
      await sock.sendMessage(m.key.remoteJid, { text: `Translated:\n${res.text}` });
    } catch (e) {
      await sock.sendMessage(m.key.remoteJid, { text: "Translate error." });
    }
  }
};
