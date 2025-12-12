export default {
  name: "toggle",
  desc: "Toggle features",
  exec: async ({ sock, m, from, sender, args, config, store, saveStore }) => {
    if (sender !== config.ownerNumber) return await sock.sendMessage(from, { text: config.messages.owner });
    const [feature, mode] = args;
    if (!feature || !mode) return await sock.sendMessage(from, { text: "Usage: .toggle <feature> on|off" });
    const key = feature.trim();
    const val = mode.toLowerCase() === "on";
    store[key] = val;
    saveStore(store);
    await sock.sendMessage(from, { text: `${key} set to ${val}` });
  }
};
