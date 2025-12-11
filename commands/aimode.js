export default {
  name: "aimode",
  desc: "toggle auto-AI mode (owner only): .aimode on|off",
  exec: async ({ sock, m, args, sender }) => {
    const fs = await import("fs");
    const file = "./config.json";
    if (sender !== "233556956753") return await sock.sendMessage(m.key.remoteJid, { text: "Owner only." });
    if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({ autoAI: false }, null, 2));
    const cfg = JSON.parse(fs.readFileSync(file));
    const mode = args[0];
    if (mode === "on") cfg.autoAI = true;
    else if (mode === "off") cfg.autoAI = false;
    else return await sock.sendMessage(m.key.remoteJid, { text: "Usage: .aimode on|off" });
    fs.writeFileSync(file, JSON.stringify(cfg, null, 2));
    await sock.sendMessage(m.key.remoteJid, { text: "Auto AI: " + cfg.autoAI });
  }
};
