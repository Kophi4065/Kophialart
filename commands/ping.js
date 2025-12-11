export default {
  name: "ping",
  desc: "Ping",
  exec: async ({ sock, m, from }) => {
    const t0 = Date.now();
    await sock.sendMessage(from, { text: "Pinging..." });
    const t1 = Date.now();
    await sock.sendMessage(from, { text: `Pong! ${t1 - t0} ms` });
  }
};
