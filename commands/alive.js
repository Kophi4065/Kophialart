export default {
  name: "alive",
  desc: "Check bot is alive",
  exec: async ({ sock, m, from, config }) => {
    const txt = `🔥 ${config.botName} is online!\nOwner: ${config.ownerName} (${config.ownerNumber})`;
    await sock.sendMessage(from, { text: txt });
  }
};
