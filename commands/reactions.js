export default {
  name: "react",
  desc: "react with emoji: .happy .love .fire",
  exec: async ({ sock, m }) => {
    const txt = (m.message?.conversation || "").trim();
    const map = { happy: "😄", love: "❤️", fire: "🔥", sad: "😢", wow: "😮", ok: "👌" };
    const key = txt.split(" ")[0].replace(".", "");
    if (map[key]) {
      await sock.sendMessage(m.key.remoteJid, { react: { text: map[key], key: m.key } });
    }
  }
};
