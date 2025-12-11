export default {
  name: "antidelete",
  desc: "anti-delete handler placeholder",
  exec: async ({ sock, m, from, store }) => {
    // Global anti-delete is handled in index.js messages.update
    await sock.sendMessage(from, { text: "Anti-delete is active." });
  }
};
