export default {
  name: "antilink",
  desc: "scan messages for group invite links and remove sender",
  exec: async ({ sock, m }) => {
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
    const glink = /(https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+)/i;
    if (glink.test(text) && m.key.remoteJid.endsWith("@g.us")) {
      try {
        await sock.sendMessage(m.key.remoteJid, { text: "🚫 Group link detected. Removing user." });
        await sock.groupParticipantsUpdate(m.key.remoteJid, [m.key.participant], "remove");
      } catch (e) { console.log("antilink err", e); }
    }
  }
};
