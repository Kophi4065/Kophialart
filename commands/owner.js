export default {
  name: "owner",
  desc: "Owner utilities",
  exec: async ({ sock, m, from, sender, args, config }) => {
    if (sender !== config.ownerNumber) return await sock.sendMessage(from, { text: config.messages.owner });

    const body = (m.message?.conversation || m.message?.extendedTextMessage?.text || "").trim();
    if (!body) return;

    const cmd = body.slice(config.prefix.length).split(" ")[0];

    switch (cmd) {
      case "shutdown":
        await sock.sendMessage(from, { text: "🛑 Shutting down..." });
        process.exit(0);
      case "restart":
        await sock.sendMessage(from, { text: "♻️ Restarting..." });
        process.exit(1);
      case "block":
        {
          const target = m.message?.extendedTextMessage?.contextInfo?.participant;
          if (!target) return await sock.sendMessage(from, { text: "Tag a user to block." });
          await sock.updateBlockStatus(target, "block");
          await sock.sendMessage(from, { text: "User blocked." });
        }
        break;
      case "unblock":
        {
          const target = m.message?.extendedTextMessage?.contextInfo?.participant;
          if (!target) return await sock.sendMessage(from, { text: "Tag a user to unblock." });
          await sock.updateBlockStatus(target, "unblock");
          await sock.sendMessage(from, { text: "User unblocked." });
        }
        break;
      case "bc":
        {
          const text = body.replace(config.prefix + "bc ", "").trim();
          if (!text) return await sock.sendMessage(from, { text: "Usage: .bc <message>" });
          const groups = await sock.groupFetchAllParticipating();
          for (let id in groups) {
            await sock.sendMessage(id, { text });
          }
          await sock.sendMessage(from, { text: "Broadcast sent." });
        }
        break;
      default:
        await sock.sendMessage(from, { text: "Unknown owner command." });
    }
  }
};
