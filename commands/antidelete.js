export default {
  name: "antidelete",
  desc: "anti-delete handler placeholder",
  exec: async ({ sock, m, from, store }) => {
    await sock.sendMessage(from, { text: "Anti-delete is active." });
  }
};
