export default {
  name: "ai",
  desc: "ask AI: .ai <text>",
  exec: async ({ sock, m, args }) => {
    const prompt = args.join(" ");
    if (!prompt) return await sock.sendMessage(m.key.remoteJid, { text: "Send: .ai <question>" });
    try {
      const axios = (await import("axios")).default;
      const res = await axios.get("https://api.safone.tech/ai?query=" + encodeURIComponent(prompt), { timeout: 15000 });
      const reply = res.data?.response || "AI did not reply.";
      await sock.sendMessage(m.key.remoteJid, { text: reply });
    } catch (e) {
      await sock.sendMessage(m.key.remoteJid, { text: "AI error." });
    }
  }
};
