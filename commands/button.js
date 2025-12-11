export default {
  name: "button",
  desc: "show a button panel",
  exec: async ({ sock, m }) => {
    const jid = m.key.remoteJid;
    const message = {
      text: "🔥 *Kophialart Bot Control Panel* 🔥",
      footer: "Choose an option below",
      buttons: [
        { buttonId: ".menu", buttonText: { displayText: "📜 Menu" }, type: 1 },
        { buttonId: ".ping", buttonText: { displayText: "📡 Check Speed" }, type: 1 },
        { buttonId: ".ai hello", buttonText: { displayText: "🤖 Ask AI" }, type: 1 }
      ],
      headerType: 1
    };
    await sock.sendMessage(jid, message);
  }
};
